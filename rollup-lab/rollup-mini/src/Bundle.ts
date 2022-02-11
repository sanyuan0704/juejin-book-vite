import { readFile } from 'fs/promises';
import Module from './Module';
import { dirname, resolve } from 'path';
import { has } from './utils/obejct';
import { defaultResolver } from './utils/resolve';
import { Statement } from './Statement';
import * as MagicString from 'magic-string';

interface BundleOptions {
  entry: string;
}

export default class Bundle {
  entryPath: string;
  basedir: string;
  modulePromises: Record<string, Promise<Module>>;
  statements: Statement[];
  constructor(options: BundleOptions) {
    const { entry } = options;
    this.entryPath = resolve(entry);
    this.basedir = dirname(this.entryPath);
    this.modulePromises = {};
    this.statements = [];
  }

  // 加载模块并解析
  fetchModule(id: string, importer: null | string): Promise<Module> {
    const path = defaultResolver(id, importer);
    // external
    if (path === false) {
      // TODO
      return this.modulePromises[id];
    }
    if (!has(this.modulePromises, path)) {
      this.modulePromises[path] = readFile(path, { encoding: 'utf-8' }).then(
        (source) => {
          return new Module({
            path,
            source,
            bundle: this
          });
        }
      );
    }
    return this.modulePromises[path];
  }

  async build() {
    const module = await this.fetchModule(this.entryPath, null)
    this.statements = await module.expandAllStatements();
  }

  render(): { code: string; map: MagicString.SourceMap } {
    let msBundle = new MagicString.Bundle({ separator: '\n' });
    this.statements.forEach(statement => {
      const source = statement.magicString.clone().trim();
      if (statement.isExportDeclaration) {
				// remove `export` from `export const foo = 42`
        if (
          statement.node.type === 'ExportNamedDeclaration' &&
          statement.node.declaration.type === 'VariableDeclaration'
        ) {
          source.remove(statement.node.start, statement.node.declaration.start)
        }
      }
      msBundle.addSource({
        content: source,
        
      });
    })
    const map = msBundle.generateMap({ includeContent: true })
    return {
      code: msBundle.toString(),
      map
    }
  }
}
