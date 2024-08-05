import { isArray, isBuffer, isDate, isFunction, isNil, isNumber, isObject, isPrimitive } from '../utils/utils';

export type IDotizeDotifyArrayMode = 'dotify'|'dotify-bracket'|'dotify-curly-bracket'|'keep';
export type IDotizeDotifyObjArrMode = 'keep'|'remove';
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
     * The empty object mode defines how empty objects{} should be handled
     * > keep - Empty objects are kept and {} is set as the value.
     * > remove - Empty objects will be removed.
     */
    emptyObjectMode: IDotizeDotifyObjArrMode;

    /**
     * The empty array mode defines how empty arrays[] should be handled
     * > keep - Empty arrays are kept and [] is set as the value.
     * > remove - Empty arrays will be removed.
     */
    emptyArrayMode: IDotizeDotifyObjArrMode;

    /**
     * The method processes an object to the defined maxDepth. All beyond the maxDepth gets added to the dotified object as a whole
     */
    maxDepth: number;

    /**
     * With the filter you can control if the object should be dotified or not
     */
    filter: (object: any) => boolean;
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
        emptyObjectMode: options?.emptyObjectMode || 'keep',
        emptyArrayMode: options?.emptyArrayMode || 'keep',
        maxDepth: options?.maxDepth || 0,
        filter: options?.filter || null,
    }, 0)
}

function _dotify(object: any|any[], prefix: string, options: IDotizeDotifyOptions, depth: number): any {

    // create base dotified object
    let dotified: IDotified = {};

    // check depth
    depth = isNumber(depth) ? depth : 0;

    // create helper function to build a returnable dotified object
    const createDotifiedObject = () => {
        if(!prefix) return object;
        dotified[prefix] = object;
        return dotified;
    }

    // return primitive types, functions or array if options.arrayMode is 'keep'
    if(
      (options.filter && !options.filter(object)) ||
      isNil(object) ||
      isPrimitive(object) ||
      //(isArray(object) && options.arrayMode === 'keep') ||
      //(!isArray(object) && isObject(object) && Object.keys(object).length === 0) ||
      isFunction(object) ||
      isBuffer(object) ||
      isDate(object) ||
      (options.maxDepth > 0 && depth >= options.maxDepth)
    ){
        return createDotifiedObject();
    }

    // check array options
    if(isArray(object) && (options.arrayMode === 'keep' || (object.length === 0 && options.emptyArrayMode === 'keep'))){
        // return the full array if the arrayMode is set to keep
        if(options.arrayMode === 'keep') return createDotifiedObject();

        // return the empty array if the array is empty and the emptyArrayMode is set to keep
        if(options.emptyArrayMode === 'keep' && object.length === 0) return createDotifiedObject();
    }

    // check object options
    if(isObject(object)){
        // return the empty object if the object is empty and the emptyObjectMode is set to keep
        if(options.emptyObjectMode === 'keep' && Object.keys(object).length === 0) return createDotifiedObject();
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