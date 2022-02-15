const a = 1;

const b = a + 1;

const multi = (a, b) => a * b;

function testFunc() {
  console.log(a);
}

const afunc = (a, b) => a + b;

const dep1 = Object.freeze({
  b: b,
  multi: multi,
  testFunc: testFunc,
  default: afunc
});

const testDefaultFunc$1 = function testDefaultFunc$1() {
  console.log(1);
}
export const cc = dep1.b;
export const bb = testDefaultFunc$1();
export const aa = dep1.testFunc();

export default dep1.multi;