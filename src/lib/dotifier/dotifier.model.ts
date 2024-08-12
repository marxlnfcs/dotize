import { IDotizeDotifyOptions } from './dotifier.interface';
import {
  addPrefix,
  createOutput, escapeSeparator,
  isArray,
  isDate,
  isFunction,
  isNil,
  isNumber, isObject,
  isPrimitive,
  omitEmpty,
} from '../utils/utils';

export function dotizeDotify(data: any, options?: Partial<IDotizeDotifyOptions>): any {

  // create instance
  const instance = new DotizeDotifier(data, {
    prefix: options?.prefix?.trim() || null,
    separator: (options?.separator || '.').trim(),
    arrayMode: options?.arrayMode || 'bracket',
    emptyObjectStrategy: options?.emptyObjectStrategy || options?.emptyObjectMode || 'keep',
    emptyArrayStrategy: options?.emptyArrayStrategy || options?.emptyArrayMode || 'keep',
    emptyObjectMode: options?.emptyObjectMode || 'keep', // deprecated
    emptyArrayMode: options?.emptyArrayMode || 'keep', // deprecated
    maxDepth: isNumber(options?.maxDepth) ? options.maxDepth : 0,
    filter: options?.filter || null,
  });

  // return object
  return instance.toJson();

}

/** @internal */
export class DotizeDotifier {

  /**
   * @param data {any}
   * @param options {Partial<IDotizeDotifyOptions>}
   */
  constructor(
    private data: any,
    private options: IDotizeDotifyOptions,
  ){}

  toJson(): any {

    // format object
    this.data = omitEmpty(this.data, {
      omitArrays: this.options.emptyArrayStrategy === 'remove',
      omitObjects: this.options.emptyObjectStrategy === 'remove',
    });

    // build object
    const output = this.build({}, this.data, null, 0);

    // return object
    return addPrefix(output, this.options.separator, this.options.prefix);

  }

  private isExcluded(object: any, depth: number): boolean {
    return (
      (this.options.maxDepth > 0 && depth >= this.options.maxDepth) ||
      isNil(object) ||
      isPrimitive(object) ||
      isFunction(object) ||
      isDate(object) ||
      (this.options.filter && !this.options.filter(object, depth))
    );
  }

  private joinPath(key: string, prefix?: string|null, disableSeparator?: boolean): string {

    // escape separators
    key = escapeSeparator(key, this.options.separator);

    // return key if prefix is empty
    if(!prefix?.trim()){
      return key;
    }

    // return joined path
    return [prefix, key].map(_ => _.trim()).join(!disableSeparator ? this.options.separator : '');

  }

  private joinArrayPath(index: number, prefix?: string|null): string {

    // create key
    let key: string;

    // set prefix
    if(this.options.arrayMode === 'bracket') key = `[${index}]`;
    if(this.options.arrayMode === 'curly-bracket') key = `{${index}}`;
    if(this.options.arrayMode === 'round-bracket') key = `(${index})`;

    // return joined path
    return this.joinPath(key, prefix, true);

  }

  private build(output: any, data: any, path: string|null, depth: number): any {

    // return object if excluded
    if(this.isExcluded(data, depth)){
      return createOutput(output, data, path);
    }

    // return array if empty or arrayMode is "keep"
    if(isArray(data) && (!data.length || this.options.arrayMode === 'keep')){
      return createOutput(output, data, path);
    }

    // return object if empty
    if(isObject(data) && !Object.keys(data).length){
      return createOutput(output, data, path);
    }

    // process array
    if(isArray(data)){
      data.map((item, index) => {

        // build children
        Object.entries(this.build(output, item, this.joinArrayPath(index, path), depth + 1)).map(([key, item]) => {
          output[key] = item;
        });

      });
    }

    // process object
    if(isObject(data)){
      Object.entries(data).map(([key, item]) => {

        // build children
        Object.entries(this.build(output, item, this.joinPath(key, path), depth + 1)).map(([key, item]) => {
          output[key] = item;
        });

      });
    }

    // return output
    return output;

  }

}