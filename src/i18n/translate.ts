export function translate(dict: unknown, key: string): unknown {
  const parts = key.split('.');
  let node: unknown = dict;
  for (const p of parts) {
    if (node && typeof node === 'object' && p in (node as Record<string, unknown>)) {
      node = (node as Record<string, unknown>)[p];
    } else {
      if (import.meta.env?.DEV) {
        console.warn(`[i18n] missing translation: ${key}`);
      }
      return key;
    }
  }
  return node;
}
