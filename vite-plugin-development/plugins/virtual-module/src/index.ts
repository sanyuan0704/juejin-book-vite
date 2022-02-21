import { Plugin } from 'vite';

const FIB_MODULE_NAME = 'virtual:fib';

export default function virtualFibModulePlugin(): Plugin {
  return {
    name: 'vite-plugin-virtual-fib-module',
    resolveId(id) {
      if (id === FIB_MODULE_NAME) { 
        return id;
      }
    },
    load(id) {
      if (id === FIB_MODULE_NAME) {
        return 'export default function fib(n) { return n <= 1 ? n : fib(n - 1) + fib(n - 2); }';
      }
    }
  }
}