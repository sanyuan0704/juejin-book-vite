import { add, b } from './dep1.js';
import { log, c } from './dep2.js';

export const cc = log(b, c);
// const a = 1;
// const b = 2;
// console.log(a + b);
// log(add(a, b));
// const ss = 3 + a + b;
