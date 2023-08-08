<p align="center" style="font-size: 40px;">Dotize</p>

<p align="center">A simple TypeScript library to convert complex objects into simple key value pairs</p>
<p align="center">
    <a href="https://www.npmjs.com/package/@marxlnfcs/dotize" target="_blank"><img src="https://img.shields.io/npm/v/@marxlnfcs/dotize.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/package/@marxlnfcs/dotize" target="_blank"><img src="https://img.shields.io/npm/l/@marxlnfcs/dotize.svg" alt="Package License" /></a>
    <a href="https://www.npmjs.com/package/@marxlnfcs/dotize" target="_blank"><img src="https://img.shields.io/npm/dm/@marxlnfcs/dotize.svg" alt="NPM Downloads" /></a>
    <a href="https://www.npmjs.com/package/@marxlnfcs/dotize" target="_blank"><img src="https://img.shields.io/bundlephobia/min/@marxlnfcs/dotize?label=size" alt="Package Size" /></a>
</p>

## Installation
```
npm i @marxlnfcs/dotize
```

## Usage
```typescript
import { Dotize, dotify, parse } from '@marxlnfcs/dotize';

// source object
const obj: any = {
    "key1": 'value1',
    "key2": [
        {
            "foo": "bar"
        },
        "weird_item_inside_an_array_of_objects"
    ],
    "key3": {
        "foo": "bar",
    }
};

// dotify source object
const dotified = Dotize.dotify({ ... });
const dotified = dotify({ ... });

/**
 * Output:
 * {
 *  "key1": "value",
 *  "key2.[0].foo": "bar",
 *  "key2.[1]: "weird_item_inside_an_array_of_objects",
 *  "key3.foo": "bar",
 * }
 */

// parse dotified object
const parsed = Dotize.parse({ ... });
const parsed = parse({ ... });

```

## Options
### Dotize.dotify( ... ):
```typescript
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
 * > dotify-bracket: The index will be surrounded with brackets (default). Example: "foo.[0].bar"
 * > dotify-curly-bracket: The index will be surrounded with curly brackets. Example: "foo.{0}.bar"
 * > keep: Arrays will be ignored. Example: { "foo": [ { "bar": "Hello World!" } ] }
 */
arrayMode: 'dotify'|'dotify-bracked'|'dotify-curly-bracket'|'keep';

/**
 * The method processes an object to the defined maxDepth. All beyond the maxDepth gets added to the dotified object as a whole
 */
maxDepth: number;
```

### Dotize.parse( ... ):
```typescript
/**
 * The prefix will be removed from every key in the dotified object
 * @example "$"
 * @default null
 */
prefix: string;

/**
 * Defines the separator that has been used to dotify the object
 * @example "_"
 * @default "."
 */
separator: string;

/**
 * The array mode defines how arrays are handled
 * > dotify: The index is set as plain number. Example: foo.0.bar
 * > dotify-bracket: The index is surrounded with brackets (default). Example: "foo.[0].bar"
 * > dotify-curly-bracket: The index is surrounded with curly brackets. Example: "foo.{0}.bar"
 */
arrayMode: 'dotify'|'dotify-bracked'|'dotify-curly-bracket';

/**
 * How to handle situations, were the parent is not an object, array or the child is incompatible with the parent (E.g. parent: array, child: not an array item)
 * > override: Converts the parent to a compatible type
 * > ignore: Skips the child item
 * > throwError: Throws an TypeError
 */
incompatibleTypeStrategy: 'override'|'skip'|'throwError';
```