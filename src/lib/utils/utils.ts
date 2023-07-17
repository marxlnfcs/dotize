/** @internal */
export function isNil(n: any): n is null|undefined {
    return n === undefined || n === null;
}

/** @internal */
export function isObject(n: any): n is object {
    return !isNil(n) && !isArray(n as any) && !isFunction(n);
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