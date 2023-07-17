import {dotify, IDotified, IDotizeDotifyOptions} from "./functions/dotify";
import {IDotizeParseOptions, parse} from "./functions/parse";

export class Dotize {
    static dotify<T = any>(obj: T, options?: Partial<IDotizeDotifyOptions>): IDotified {
        return dotify(obj, options);
    }
    static parse<T = any>(obj: IDotified, options?: Partial<IDotizeParseOptions>): T {
        return parse(obj, options);
    }
}