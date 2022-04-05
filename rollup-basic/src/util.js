export const add = (a, b) => a + b;

export * from "./multi";

export const testSideEffect = (obj) => {
  console.log(obj.x);
};
