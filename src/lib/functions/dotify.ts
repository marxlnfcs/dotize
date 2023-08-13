import {isArray, isFunction, isNumber, isPrimitive} from "../utils/utils";

export type IDotizeDotifyArrayMode = 'dotify'|'dotify-bracket'|'dotify-curly-bracket'|'keep';
export interface IDotizeDotifyOptions {
    /**
     * The prefix will be added to every key on depth 0
     * @example "$"
     * @default null
     */
    prefix: string;

    /**
     * Defines the separator that will be used to create the path
     * @example "_"
     * @default "."
     */
    separator: string;

    /**
     * The array mode defines how arrays are handled
     * > dotify: The index will be set as plain number. Example: foo.0.bar
     * > dotify-bracket: The index will be wrapped with surrounded (default). Example: "foo.[0].bar"
     * > dotify-curly-bracket: The index will be surrounded with curly brackets. Example: "foo.{0}.bar"
     * > keep: Arrays will be ignored. Example: { "foo": [ { "bar": "Hello World!" } ] }
     */
    arrayMode: IDotizeDotifyArrayMode;

    /**
     * The method processes an object to the defined maxDepth. All beyond the maxDepth gets added to the dotified object as a whole
     */
    maxDepth: number;

}

export type IDotified = { [path: string]: any };

export function dotify(object: any|any[], options?: Partial<IDotizeDotifyOptions>): IDotified {
    options = options || {};
    options.maxDepth = isNumber(options?.maxDepth) ? options.maxDepth : 0;
    options.prefix = options.prefix?.trim()?.endsWith('.') ? options.prefix.slice(0, -1) : options.prefix
    return _dotify(object, '', {
        prefix: (options?.prefix || '').trim(),
        separator: (options?.separator || '.').trim(),
        arrayMode: options?.arrayMode || 'dotify-bracket',
        maxDepth: options?.maxDepth || 0,
    }, 0)
}

function _dotify(object: any|any[], prefix: string, options: IDotizeDotifyOptions, depth: number): any {

    // create base dotified object
    let dotified: IDotified = {};

    // check depth
    depth = isNumber(depth) ? depth : 0;

    // return primitive types, functions or array if options.arrayMode is 'keep'
    if(
        isPrimitive(object) ||
        (isArray(object) && options.arrayMode === 'keep') ||
        isFunction(object) ||
        (options.maxDepth > 0 && depth >= options.maxDepth)
    ){
        if(!prefix) return object;
        dotified[prefix] = object;
        return dotified;
    }

    // iterate through entries
    for(let key in object){
        const path = joinPath(options.separator, prefix, key, object[key], object, options.arrayMode);
        dotified = Object.assign(dotified, _dotify(object[key], path, options, depth + 1));
    }

    // concat dotified object
    const data = !depth ? _applyGlobalPrefix(dotified, options.prefix, options.separator) : dotified;

    // return dotified object
    return data;

}

function joinPath(separator: string, prefix: string, key: string|number, data: any, parentObject: any, arrayMode: IDotizeDotifyArrayMode): string {
    let _prefix: string|null = !!prefix?.trim() ? prefix : null;
    let _key: string = `${key}`;
    if(isArray(parentObject)){
        switch(arrayMode){
            case 'dotify': _key = `${_key}`; break;
            case 'dotify-bracket': _key = `[${_key}]`; break;
            case 'dotify-curly-bracket': _key = `{${_key}}`; break;
        }
    }
    return _prefix ? [_prefix, _key].join(separator) : _key;
}

function _applyGlobalPrefix(dotified: IDotified, prefix: string, separator: string): IDotified {
    const obj: IDotified = {};
    for(let key in dotified){
        if(!!prefix?.trim()){
            obj[`${prefix}${separator}${key}`] = dotified[key];
        }else{
            obj[key] = dotified[key];
        }
    }
    return obj;
}