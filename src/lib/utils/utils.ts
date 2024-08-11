/** @internal */
export function isNil(n: any): n is null|undefined {
    return n === undefined || n === null;
}

/** @internal */
export function isObject(n: any): n is object {
    return !isNil(n) && !isArray(n as any) && !isFunction(n) && typeof n === 'object';
}

/** @internal */
export function isArray(n: any): n is any[] {
    return !isNil(n) && Array.isArray(n);
}

/** @internal */
export function isFunction(n: any): n is Function {
    return !isNil(n) && typeof n === 'function';
}

/** @internal */
export function isPrimitive(n: any): n is number|boolean|string {
    return isNumber(n) || isBoolean(n) || isString(n);
}

/** @internal */
export function isNumber(n: any): n is number {
    return typeof n === 'number';
}

/** @internal */
export function isBoolean(n: any): n is boolean {
    return typeof n === 'boolean';
}

/** @internal */
export function isString(n: any): n is string {
    return typeof n === 'string';
}

/** @internal */
export function isDate(n: any): n is Date {
  return n instanceof Date;
}

/** @internal */
export function isExcluded(n: any): boolean {
  return (
    isNil(n) ||
    isPrimitive(n) ||
    isFunction(n) ||
    isDate(n)
  );
}

/** @internal */
export function createSeparator(separator: string): string {
  return separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** @internal */
export function escapeSeparator(data: string, separator: string): string {
  const patternSeparator = new RegExp(createSeparator(separator), 'g');
  return data.replace(patternSeparator, `\\${separator}`);
}

/** @internal */
export function unescapeSeparator(data: string, separator: string): string {
  return data.replace(createSeparator(separator), `\\${separator}`);
}

/** @internal */
export function splitBySeparator(data: string, separator: string): string[] {
  const pattern = new RegExp(`(?<!\\\\)${createSeparator(separator)}`, 'g');
  const parts = data.split(pattern);
  return parts;
}

/** @internal */
export function unescapeObjectKeys(obj: any, separator: string): any {
  const unescapeRegex = new RegExp(`\\\\${createSeparator(separator)}`, 'g');
  function unescapeKeysRecursive(currentObj: any) {
    if (isExcluded(currentObj) || typeof currentObj !== 'object') {
      return currentObj;
    }
    const result = Array.isArray(currentObj) ? [] : {};
    for (let key in currentObj) {
      const unescapedKey = key.replace(unescapeRegex, separator);
      result[unescapedKey] = unescapeKeysRecursive(currentObj[key]);
    }
    return result;
  }
  return unescapeKeysRecursive(obj);
}