import valueIsUndefined = require("lodash.isundefined");

export type MatchResult<T> = Readonly<{
  matches: boolean;
  data?: T;
  diff?: Diff;
}>;

export type Diff = Readonly<{
  expected: any;
  actual: any;
}>;

export class MatchResultBuilder<T> {
  private _matches: boolean = false;
  private _data?: T;
  private _diff?: Diff;

  public setMatches(matches: boolean): this {
    this._matches = matches;
    return this;
  }

  public setData(data: T | undefined): this {
    this._data = data;
    return this;
  }

  public setDiff(diff: Diff | undefined): this {
    this._diff = diff;
    return this;
  }

  public build(): MatchResult<T> {
    return this.maybeAddData(this.maybeAddDiff({ matches: this._matches }));
  }

  private maybeAddDiff(result: MatchResult<T>): MatchResult<T> {
    if (valueIsUndefined(this._diff)) {
      return result;
    }

    return {
      ...result,
      diff: this._diff,
    };
  }

  private maybeAddData(result: MatchResult<T>): MatchResult<T> {
    if (valueIsUndefined(this._data)) {
      return result;
    }

    return {
      ...result,
      data: this._data,
    };
  }
}
