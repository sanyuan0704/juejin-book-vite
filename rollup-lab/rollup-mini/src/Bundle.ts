import { readFile } from 'fs/promises';
import Module from './Module';
import { dirname, resolve } from 'path';
import { has } from 'utils/obejct';
import { defaultResolver } from 'utils/resolve';

interface BundleOptions {
  entry: string;
}

export default class Bundle {
  entryPath: string;
  basedir: string;
  modulePromises: Record<string, Promise<Module>>;
  constructor(options: BundleOptions) {
    const { entry } = options;
    this.entryPath = resolve(entry);
    this.basedir = dirname(this.entryPath);
    this.modulePromises = {};
  }

  // 加载模块并解析
  async fetchModule(id: string, importer: null | string) {
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
    return this.fetchModule(this.entryPath, null).then();
  }

  render() {
    return '';
  }
}
