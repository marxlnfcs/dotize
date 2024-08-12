import { IDotizeDotifyOptions } from '../dotifier/dotifier.interface';

export type IDotizeParseArrayMode = 'bracket'|'curly-bracket'|'round-bracket';
export type IDotifyParseIncompatibleTypeStrategy = 'override'|'skip'|'throwError';

export interface IDotizeParseOptions extends Pick<IDotizeDotifyOptions, 'prefix'|'separator'> {

  /**
   * The array mode defines how arrays are handled
   * > bracket: The index will be wrapped with surrounded (default). Example: "foo[0].bar"
   * > curly-bracket: The index will be surrounded with curly brackets. Example: "foo{0}.bar"
   * > round-bracket: The index will be surrounded with round brackets. Example: "foo(0).bar"
   * @default bracket
   */
  arrayMode: IDotizeParseArrayMode;

  /**
   * How to handle situations, were the parent is not an object, array or the child is incompatible with the parent (E.g. parent: array, child: not an array item)
   * > override: Converts the parent to a compatible type
   * > ignore: Skips the child item
   * > throwError: Throws an TypeError
   * @default throwError
   */
  incompatibleTypeStrategy: IDotifyParseIncompatibleTypeStrategy;

  /**
   * Fill missing indexes of arrays. If false, the items will be pushed directly to the array and the index could change.
   * @default true
   */
  arrayFillMissingIndexes: boolean;

}