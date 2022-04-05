export const keys = Object.keys;
export const values = Object.values;

export const hasOwnProp = Object.prototype.hasOwnProperty;

export function has(obj: any, prop: string) {
  return hasOwnProp.call(obj, prop);
}
