import { HASH_RE, JS_TYPES_RE, QEURY_RE } from "./constants";

export const cleanUrl = (url: string): string =>
  url.replace(HASH_RE, "").replace(QEURY_RE, "");

export const isCSSRequest = (id: string): boolean =>
  cleanUrl(id).endsWith(".css");

export const isJSRequest = (id: string): boolean =>
  JS_TYPES_RE.test(cleanUrl(id));

export function isImportRequest(url: string): boolean {
  return url.endsWith("?import");
}

export function removeImportQuery(url: string): string {
  return url.replace(/\?import$/, "");
}

export function isPlainObject(obj: any): boolean {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
