import { dotizeDotify } from './dotifier/dotifier.model';
import { dotizeParse } from './parser/parser.model';
import { IDotizeDotifyOptions } from './dotifier/dotifier.interface';
import { IDotizeParseOptions } from './parser/parser.interface';

export class Dotize {

  /**
   * Dotify and returns an object
   * @param obj
   * @param options
   */
  static dotify<T = any>(obj: T, options?: Partial<IDotizeDotifyOptions>): any {
      return dotizeDotify(obj, options);
  }

  /**
   * Parse and return a dotified object
   * @param obj
   * @param options
   */
  static parse<T = any>(obj: any, options?: Partial<IDotizeParseOptions>): T {
      return dotizeParse(obj, options);
  }

}