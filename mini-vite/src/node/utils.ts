import { HASH_RE, JS_TYPES_RE, QEURY_RE } from "./constants";
import path from "path";

const INTERNAL_LIST = ["/@vite/client", "/@react-refresh"];

export const cleanUrl = (url: string): string =>
  url.replace(HASH_RE, "").replace(QEURY_RE, "");

export const isCSSRequest = (id: string): boolean =>
  cleanUrl(id).endsWith(".css");

export const isJSRequest = (id: string): boolean =>
  JS_TYPES_RE.test(cleanUrl(id));

export function isImportRequest(url: string): boolean {
  return url.endsWith("?import");
}

export function isInternalRequest(url: string): boolean {
  return INTERNAL_LIST.includes(url);
}

export function removeImportQuery(url: string): string {
  return url.replace(/\?import$/, "");
}

export function isPlainObject(obj: any): boolean {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

export function getShortName(file: string, root: string) {
  return file.startsWith(root + "/") ? path.posix.relative(root, file) : file;
}
