import { IDotizeParseOptions } from './parser.interface';
import {
  addPrefix,
  isArray,
  isNil,
  isObject,
  removePrefix,
  splitBySeparator,
  unescapeObjectKeys,
} from '../utils/utils';

export function dotizeParse(data: any, options?: Partial<IDotizeParseOptions>): any {

  // create instance
  const instance = new DotizeParser(data, {
    prefix: options?.prefix?.trim() || null,
    separator: (options?.separator || '.').trim(),
    arrayMode: options?.arrayMode || 'bracket',
    incompatibleTypeStrategy: options?.incompatibleTypeStrategy || 'throwError',
    arrayFillMissingIndexes: options?.arrayFillMissingIndexes ?? true,
  });

  // return object
  return instance.toJson();

}

export class DotizeParser {

  /**
   * @param data {any}
   * @param options {Partial<IDotizeParseOptions>}
   */
  constructor(
    private data: any,
    private options: IDotizeParseOptions,
  ){}

  toJson(): any {

    // return original data if not object
    if(!isObject(this.data)){
      return this.data;
    }

    // remove prefix
    this.data = removePrefix(this.data, this.options.separator, this.options.prefix);

    // create output
    let output: any;

    // process object
    Object.keys(this.data).map(key => {
      if(!output){
        output = this.build(output, key, this.data[key]);
      }else{
        this.build(output, key, this.data[key])
      }
    });

    // return parsed object
    return unescapeObjectKeys(!isNil(output) ? output : this.data, this.options.separator);

  }

  private getArrayRegex(): RegExp|null {
    switch(this.options.arrayMode){
      case 'bracket': return new RegExp(/\[(\d+)]/,);
      case 'curly-bracket': return new RegExp(/\{(\d+)}/,);
      case 'round-bracket': return new RegExp(/\((\d+)\)/,);
    }
  }

  private splitIntoArrayPaths(key: string): string[] {

    // create regex variable
    let regex: RegExp;

    // set array regex
    if(this.options.arrayMode === 'bracket') {
      regex = /([^[\]]+|\[\d*\])/g;
    }else if(this.options.arrayMode === 'curly-bracket') {
      regex = /([^[\]]+|\{\d*\})/g;
    } else if(this.options.arrayMode === 'round-bracket'){
      regex = /([^[\]]+|\(\d*\))/g;
    }else{
      return [key];
    }

    // return matches
    return key.match(regex);

  }

  private getMissingIndexes(output: any, index: number): number[] {
    const indexes: number[] = [];
    if(isArray(output)){
      for(let n = index; n >= 0; n--){

        // create array to check if index has been found
        let found = false;

        // get indexes of output
        for(let i in output){
          if(n === parseInt(i)){
            found = true;
          }
        }

        // return true if index not found
        if(!found){
          indexes.push(n);
        }

      }
    }
    return indexes.reverse();
  }

  private hasMissingIndex(output: any, index: number): boolean {
    return !!this.getMissingIndexes(output, index).length;
  }

  private build(output: any, path: string|null, value: any): any {

    // create paths
    const paths = splitBySeparator(path, this.options.separator);

    // create key paths
    const pathsKey = this.splitIntoArrayPaths(paths.shift());

    // create key
    const key = pathsKey.shift();

    // add remaining paths from pathsKey to path
    paths.unshift(...pathsKey);

    // set new path
    path = paths.join(this.options.separator);

    // check if pathKey matches an array key
    if(this.getArrayRegex().test(key)){
      return this.buildArray(output, path, parseInt(key.match(this.getArrayRegex())[1]), value);
    }else{
      return this.buildObject(output, path, key, value);
    }

  }

  private buildArray(output: any, path: string|null, index: number, value: any): any {

    // set type of output to array if undefined or null
    if(output === undefined || output === null){
      output = [];
    }

    // check type of object
    if(!isArray(output)){
      switch(this.options.incompatibleTypeStrategy){
        case 'skip': return output;
        case 'throwError': throw new TypeError(`Cannot create index '${index}' on ${typeof output} '${output}'`);
        case 'override': output = [];
      }
    }

    // fill missing indexes
    if(this.hasMissingIndex(output, index) && this.options.arrayFillMissingIndexes){
      this.getMissingIndexes(output, index).map(i => output[i] = null);
    }

    // get missing indexes
    const missingIndexes = this.hasMissingIndex(output, index);

    // push item if missingIndexes is true
    if(missingIndexes){
      index = output.push(null);
    }

    // build item
    output[index] = path ? this.build(output[index], path, value) : value;

    // return output
    return output;

  }

  private buildObject(output: any, path: string|null, key: string, value: any): any {

    // set type of output to object if undefined or null
    if(output === undefined || output === null){
      output = {};
    }

    // check type of object
    if(!isObject(output)){
      switch(this.options.incompatibleTypeStrategy){
        case 'skip': return output;
        case 'throwError': throw new TypeError(`Cannot create property '${key}' on ${typeof output} '${output}'`);
        case 'override': output = {};
      }
    }

    // build item
    output[key] = path ? this.build(output[key], path, value) : value;

    // return output
    return output;

  }

}