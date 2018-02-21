import valueIsUndefined = require("lodash.isundefined");

import { DescriptionBuilder, Diff, Matcher, MatchResult } from "../src";

export class MockMatcherBuilder<A, T = any> {
  private _matches: boolean = true;
  private _expected: string = "";
  private _actual: string = "";
  private _diff?: Diff;
  private _data?: T;

  public setExpected(expected: string): this {
    this._expected = expected;
    return this;
  }

  public setActual(actual: string): this {
    this._actual = actual;
    return this;
  }

  public setMatches(matches: boolean): this {
    this._matches = matches;
    return this;
  }

  public setData(data: T): this {
    this._data = data;
    return this;
  }

  public setDiff(diff: Diff): this {
    this._diff = diff;
    return this;
  }

  public build(): MockMatcher<A, T> {
    // tslint:disable-next-line no-use-before-declare //
    return new MockMatcher<A, T>(this._expected, this._actual, this._matches, this._data, this._diff);
  }
}

export class MockMatcher<A, T = any> implements Matcher<A, T> {
  public static builder<A>(): MockMatcherBuilder<A> {
    return new MockMatcherBuilder<A>();
  }

  public static matches<A>(): MockMatcher<A> {
    return MockMatcher.builder<A>()
      .setMatches(true)
      .build();
  }

  public static fails<A>(): MockMatcher<A> {
    return MockMatcher.builder<A>()
      .setMatches(false)
      .build();
  }

  private _matchActual: A | undefined;
  private _matchCalledCount: number = 0;
  private _describeExpectedCalledCount: number = 0;
  private _describeActualCalledCount: number = 0;

  public constructor(private readonly _expectedDescription: string,
                     private readonly _actualDescription: string,
                     private readonly _matches: boolean,
                     private readonly _data?: T,
                     private readonly _diff?: Diff) {}

  public get matchActual(): A | undefined {
    return this._matchActual;
  }

  public get matchCalledCount(): number {
    return this._matchCalledCount;
  }

  public get describeExpectedCalledCount(): number {
    return this._describeExpectedCalledCount;
  }

  public get describeActualCalledCount(): number {
    return this._describeActualCalledCount;
  }

  public match(actual: A): MatchResult {
    this._matchActual = actual;
    this._matchCalledCount += 1;

    return this.maybeAddData(this.maybeAddDiff({ matches: this._matches }));
  }

  public describeExpected(): string {
    this._describeExpectedCalledCount += 1;
    return this._expectedDescription;
  }

  public describeActual(actual: A): string {
    this._describeActualCalledCount += 1;
    return this._actualDescription;
  }

  public describeResult(data: T, builder: DescriptionBuilder): void {}

  private maybeAddDiff(result: MatchResult): MatchResult {
    if (valueIsUndefined(this._diff)) {
      return result;
    }

    return {
      ...result,
      diff: this._diff,
    };
  }

  private maybeAddData(result: MatchResult): MatchResult {
    if (valueIsUndefined(this._data)) {
      return result;
    }

    return {
      ...result,
      data: this._data,
    };
  }
}
