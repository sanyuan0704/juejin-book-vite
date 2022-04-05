const a = 1;

export const b = a + 1;

export const multi = function (a, b) {
  return a * b;
};

export function testFunc() {
  console.log(a);
}

export default function (a, b) {
  return a + b;
}
