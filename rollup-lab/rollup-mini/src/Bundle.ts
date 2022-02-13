import * as MagicString from 'magic-string';
import { Module } from './Module';
import { Graph } from './Graph';

interface BundleOptions {
  entry: string;
}

export class Bundle {
  graph: Graph;
  constructor(options: BundleOptions) {
    this.graph = new Graph({
      entry: options.entry,
      bundle: this
    });
  }

  async build() {
    await this.graph.build();
  }

  getModuleById(id: string) {
    return this.graph.getModuleById(id);
  }

  addModule(module: Module) {
    return this.graph.addModule(module);
  }

  render(): { code: string; map: MagicString.SourceMap } {
    let msBundle = new MagicString.Bundle({ separator: '' });

    this.graph.orderedModules.forEach((module) => {
      msBundle.addSource({
        content: module.render()
      });
    });

    const map = msBundle.generateMap({ includeContent: true });
    return {
      code: msBundle.toString(),
      map
    };
  }
}
