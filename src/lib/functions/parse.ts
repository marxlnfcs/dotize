import {IDotified, IDotizeDotifyOptions} from "./dotify";
import {isArray, isNil, isObject, isString} from "../utils/utils";

export interface IDotizeParseOptions extends Pick<IDotizeDotifyOptions, 'prefix'|'separator'|'arrayMode'> {

    /**
     * How to handle situations, were the parent is not an object, array or the child is incompatible with the parent (E.g. parent: array, child: not an array item)
     * > override: Converts the parent to a compatible type
     * > ignore: Skips the child item
     * > throwError: Throws an TypeError
     */
    incompatibleTypeStrategy: 'override'|'skip'|'throwError';

}

export function parse(object: IDotified, options?: Partial<IDotizeParseOptions>): any {
    return _parse(object, {
        prefix: (options?.prefix || '').trim(),
        separator: (options?.separator || '.').trim(),
        arrayMode: options?.arrayMode || 'dotify-bracket',
        incompatibleTypeStrategy: options?.incompatibleTypeStrategy || 'throwError',
    });
}

function _parse(object: IDotified, options: IDotizeParseOptions): any {

    // return original value if not object
    if(isNil(object) || (!isObject(object) && !isArray(object))){
        return object;
    }

    // check options
    options.prefix = options.prefix ? options.prefix.endsWith('.') ? options.prefix : options.prefix + '.' : null;

    // remove prefix from object
    if(options.prefix){
        const _object: IDotified = {};
        for(let key in object){
            if(options.prefix && isString(key) || key.startsWith(options.prefix)){
                _object[key.replace(options.prefix, '')] = object[key];
            }else{
                _object[key] = object[key];
            }
        }
        object = _object;
    }

    // create empty new object
    let obj: any;

    // iterate through object keys
    for(let key in object){
        const data = _build(obj, key, object[key], options);
        if(!obj){
            obj = data;
        }
    }

    // return new object
    return !isNil(obj) ? obj : object;

}

function _build(object: any, path: string, value: any, options: IDotizeParseOptions): any {

    // split path
    const pathArray = path.split(options.separator);

    // extract first key of pathArray
    const pathKey = pathArray.shift();

    // join new path
    path = pathArray.join(options.separator);

    // check if object should be an array
    let isObjectArrayRegex: RegExp|null;
    switch(options.arrayMode){
        case 'dotify': isObjectArrayRegex = new RegExp(/(\d+)/,); break;
        case 'dotify-bracket': isObjectArrayRegex = new RegExp(/\[(\d+)\]/,); break;
        case 'dotify-curly-bracket': isObjectArrayRegex = new RegExp(/\{(\d+)\}/,); break;
    }

    // check if pathKey matches array key
    if(isObjectArrayRegex && isObjectArrayRegex.test(pathKey)){

        // set type to array if undefined
        if(object === undefined){
            object = [];
        }

        // check type of object
        if(!isArray(object)){
            switch(options.incompatibleTypeStrategy){
                case 'override': object = []; break;
                case 'skip': return object;
                case 'throwError': throw new TypeError(`Cannot create property '${pathKey}' on ${typeof object} '${object}'`);
            }
        }

        // build object
        if(isArray(object)){
            const index = parseInt(pathKey.match(isObjectArrayRegex)[1]);
            if(path){
                if(object[index]){
                    object[index] = _build(object[index], path, value, options);
                }else{
                    object.splice(index, 0, _build(object[index], path, value, options));
                }
            }else{
                if(object[index]){
                    object[index] = value;
                }else{
                    object.splice(index, 0, value);
                }
            }
        }

        // return object
        return object;

    }

    // set type to object if undefined
    if(object === undefined){
        object = {};
    }

    // check type of object
    if(object === null || typeof object === 'function' || !isObject(object)){
        switch(options.incompatibleTypeStrategy){
            case 'override': object = {}; break;
            case 'skip': return object;
            case 'throwError': throw new TypeError(`Cannot create property '${pathKey}' on ${typeof object} '${object}'`);
        }
    }

    // parse nested key
    if(path){
        object[pathKey] = _build(object[pathKey], path, value, options);
    }else{
        object[pathKey] = value;
    }

    // return object
    return object;

}