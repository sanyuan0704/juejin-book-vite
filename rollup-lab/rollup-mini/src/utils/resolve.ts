import { dirname, isAbsolute, resolve, extname } from 'path';

export function removeExtension(p: string) {
  return p.replace(extname(p), '');
}

export function defaultResolver(id: string, importer: string | null) {
  // absolute paths are left untouched
  if (isAbsolute(id)) return id;

  // external modules stay external
  if (!id.startsWith('.')) return false;

  const resolvedPath = importer ? resolve(dirname(importer), id) : resolve(id);
  return resolvedPath;
}
