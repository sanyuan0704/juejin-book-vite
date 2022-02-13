import { basename } from 'path';
import { writeFile } from 'fs';
import { Bundle } from './Bundle';

export interface RollupOptions {
  input: string;
  output: string;
}

export function rollup(options: RollupOptions) {
  const bundle = new Bundle({
    entry: options.input
  });

  return bundle.build().then(() => {
    return {
      generate: () => bundle.render()
      // write: (dest, options = {}) => {
      //   let { code, map } = bundle.generate({
      //     dest,
      //     format: options.format,
      //     globalName: options.globalName
      //   });

      //   return Promise.all([
      //     writeFile(dest, code),
      //     writeFile(dest + '.map', map.toString())
      //   ]);
      // }
    };
  });
}
