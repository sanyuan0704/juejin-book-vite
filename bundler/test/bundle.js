const a = 1;

const b = a + 1;

const multi = function (a, b) {
  return a * b;
};

function testFunc() {
  console.log(a);
}

function afunc (a, b) {
  return a + b;
}

const dep1 = Object.freeze({
  b: b,
  multi: multi,
  testFunc: testFunc,
  default: afunc
});

function testDefaultFunc () {
  console.log(1);
}
export const cc = dep1.b;
export const bb = testDefaultFunc();
export const aa = dep1.testFunc();

export default dep1.multi;