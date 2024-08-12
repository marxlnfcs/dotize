export type IDotizeDotifyArrayMode = 'bracket'|'curly-bracket'|'round-bracket'|'keep';
export type IDotizeDotifyEmptyObjArrayStrategy = 'keep'|'remove';

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
   * > bracket: The index will be wrapped with surrounded. Example: "foo[0].bar"
   * > curly-bracket: The index will be surrounded with curly brackets. Example: "foo{0}.bar"
   * > round-bracket: The index will be surrounded with round. Example: "foo(0).bar"
   * > keep: Arrays will be ignored. Example: { "foo": [ { "bar": "Hello World!" } ] }
   * @default bracket
   */
  arrayMode: IDotizeDotifyArrayMode;

  /**
   * The empty object strategy defines how empty objects{} should be handled
   * > keep - Empty objects are kept and {} is set as the value.
   * > remove - Empty objects will be removed.
   * @default keep
   * @deprecated Please use emptyObjectStrategy instead
   */
  emptyObjectMode: IDotizeDotifyEmptyObjArrayStrategy;

  /**
   * The empty object mode defines how empty objects{} should be handled
   * > keep - Empty objects are kept and {} is set as the value.
   * > remove - Empty objects will be removed.
   * @default keep
   */
  emptyObjectStrategy: IDotizeDotifyEmptyObjArrayStrategy;

  /**
   * The empty array mode defines how empty arrays[] should be handled
   * > keep - Empty arrays are kept and [] is set as the value.
   * > remove - Empty arrays will be removed.
   * @default keep
   * @deprecated Please use emptyArrayStrategy instead
   */
  emptyArrayMode: IDotizeDotifyEmptyObjArrayStrategy;

  /**
   * The empty array strategy defines how empty arrays[] should be handled
   * > keep - Empty arrays are kept and [] is set as the value.
   * > remove - Empty arrays will be removed.
   * @default keep
   */
  emptyArrayStrategy: IDotizeDotifyEmptyObjArrayStrategy;

  /**
   * The method processes an object to the defined maxDepth. All beyond the maxDepth gets added to the dotified object as a whole
   * @default -1
   */
  maxDepth: number;

  /**
   * With the filter you can control if the object should be dotified or not
   */
  filter: (object: any, depth: number) => boolean;

}