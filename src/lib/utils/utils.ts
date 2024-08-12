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

/** @internal */
export function omitEmptyArray(object: any): any {
  return isArray(object) ? object.filter(item => item !== undefined).length === 0 ? undefined : object : object;
}

/** @internal */
export function omitEmptyObject(object: any): any {
  if(isObject(object)){
    const output: any = {};
    for(const [key, value] of Object.entries(object)){
      if(value !== undefined){
        output[key] = value;
      }
    }
    return Object.keys(output).length ? output : undefined;
  }
  return object;
}

/** @internal */
export interface OmitEmptyOptions {
  omitObjects: boolean;
  omitArrays: boolean;
}

/** @internal */
export function omitEmpty(object: any, options: Partial<OmitEmptyOptions>): any {

  // set options
  const opts: OmitEmptyOptions = {
    omitObjects: options?.omitObjects ?? true,
    omitArrays: options?.omitArrays ?? true,
  }

  // skip on specific items
  if(isDate(object) || isFunction(object)){
    return object;
  }

  // process array
  if(isArray(object)){
    object = object.map(_ => omitEmpty(_, opts)).filter(_ => _ !== undefined);
    return opts.omitArrays ? omitEmptyArray(object) : object;
  }

  // process object
  if(isObject(object)){
    Object.keys(object).map(key => {
      object[key] = omitEmpty(object[key], opts);
      if(object[key] === undefined){
        delete object[key];
      }
    });
    return opts.omitObjects ? omitEmptyObject(object) : object;
  }

  // return object
  return object;

}

/** @internal */
export function createOutput(output: any, data: any, prefix?: string|null) {

  // return object if prefix is not set
  if(!prefix){
    return data;
  }

  // add data to output
  output[prefix] = data;

  // return output
  return output;

}

/** @internal */
export function addPrefix(source: any, separator: string, prefix?: string|null): any {

  // add separator to prefix
  if(prefix?.trim()?.endsWith(separator)){
    prefix = prefix.trim().slice(0, separator.length * -1);
  }

  // return object if no prefix is set
  if(!prefix?.trim()){
    return source;
  }

  // create empty object
  const output: any = {};

  // process keys
  Object.keys(source).map(key => {

    // format key
    const prefixed = [prefix.trim(), key].join(separator);

    // set object value
    output[prefixed] = source[key]

  });

  // return output
  return output;

}

/** @internal */
export function removePrefix(source: any, separator: string, prefix?: string|null): any {

  // return object if no prefix is set
  if(!isString(prefix) || !prefix?.trim() || prefix?.trim() === separator){
    return source;
  }

  // add separator to prefix
  if(!prefix.endsWith(separator)){
    prefix = prefix + separator;
  }

  // create empty object
  const output: any = {};

  // process keys
  Object.keys(source).map(key => {
    if(key.startsWith(prefix)){
      output[key.replace(prefix, '')] = source[key];
    }else{
      output[key] = source[key];
    }
  });

  // return output
  return output;

}