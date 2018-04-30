import { EOL } from "os";

import isEqual from "lodash.isequal";

import { BaseMatcher } from "./BaseMatcher";
import { DescriptionBuilder, DescriptionLine } from "./Description";
import { Matcher } from "./Matcher";
import { Diff, MatchResult, MatchResultBuilder } from "./MatchResult";
import { printValue } from "./Printing";

export class MatcherMatchesBuilder<A, T> {
  private _expectedData: T | undefined;
  private _expectedDiff: Diff | undefined;
  private readonly _expectedMatch: boolean;

  public constructor(expectedMatch: boolean) {
    this._expectedMatch = expectedMatch;
  }

  public given(actual: A): Matcher<Matcher<A, T>, MatchResult<T>> {
    // tslint:disable-next-line no-use-before-declare //
    return new MatcherMatches<A, T>(actual, new MatchResultBuilder<T>()
      .setMatches(this._expectedMatch)
      .setDiff(this._expectedDiff)
      .setData(this._expectedData)
      .build(),
    );
  }

  public andReturnsData(expectedData: T): this {
    this._expectedData = expectedData;
    return this;
  }

  public andReturnsDiff(expectedDiff: Diff): this {
    this._expectedDiff = expectedDiff;
    return this;
  }
}

class MatcherMatches<A, T> extends BaseMatcher<Matcher<A, T>, MatchResult<T>> {
  private readonly _actual: A;
  private readonly _expectedResult: MatchResult<T>;

  public constructor(actual: A, expectedResult: MatchResult<T>) {
    super();
    this._actual = actual;
    this._expectedResult = expectedResult;
  }

  public match(matcher: Matcher<A, T>): MatchResult<MatchResult<T>> {
    const result = matcher.match(this._actual);

    return {
      matches: isEqual(this._expectedResult, result),
      data: result,
      diff: {
        expected: this._expectedResult,
        actual: result,
      },
    };
  }

  public describeExpected(): string {
    return printValue(this._expectedResult);
  }

  public describeActual(matcher: Matcher<A, T>, result: MatchResult<T>): string {
    return printValue(result);
  }
}

export const matcherMatches = <A, T = never>(): MatcherMatchesBuilder<A, T> => new MatcherMatchesBuilder<A, T>(true);

export const matcherFails = <A, T = never>(): MatcherMatchesBuilder<A, T> => new MatcherMatchesBuilder<A, T>(false);

class MatcherDescribesExpected<A, T> extends BaseMatcher<Matcher<A, T>, string> {
  private readonly _expected: string;

  public constructor(expected: string) {
    super();
    this._expected = expected;
  }

  public match(matcher: Matcher<A, T>): MatchResult<string> {
    const description = matcher.describeExpected();
    return {
      matches: description === this._expected,
      data: description,
      diff: {
        expected: this._expected,
        actual: description,
      },
    };
  }

  public describeExpected(): string {
    return `matcher to describe the expected value as:${EOL}${this._expected}`;
  }

  public describeActual(matcher: Matcher<A, T>, actual: string): string {
    return actual;
  }
}

export const matcherDescribesExpectedAs = <A, T>(expected: string): Matcher<Matcher<A, T>, string> =>
  new MatcherDescribesExpected<A, T>(expected);

export class MatcherDescribesActualBuilder<A> {
  private readonly _expected: string;

  public constructor(_expected: string) {
    this._expected = _expected;
  }

  public given(actual: A): Matcher<Matcher<A, never>, string> {
    // tslint:disable-next-line no-use-before-declare //
    return new MatcherDescribesActual<A, never>(actual, undefined as never, this._expected);
  }
}

export class MatcherDescribesActual<A, T> extends BaseMatcher<Matcher<A, T>, string> {
  private readonly _actual: A;
  private readonly _data: T;
  private readonly _expected: string;

  public constructor(actual: A, data: T, expected: string) {
    super();
    this._actual = actual;
    this._data = data;
    this._expected = expected;
  }

  public match(matcher: Matcher<A, T>): MatchResult<string> {
    const description = matcher.describeActual(this._actual, this._data);
    return {
      matches: description === this._expected,
      data: description,
      diff: {
        expected: this._expected,
        actual: description,
      },
    };
  }

  public describeExpected(): string {
    return `matcher to describe the actual value as:${EOL}${this._expected}`;
  }

  public describeActual(matcher: Matcher<A, T>, actual: string): string {
    return actual;
  }
}

export const matcherDescribesActualAs = <A>(expected: string): MatcherDescribesActualBuilder<A> => new MatcherDescribesActualBuilder<A>(expected);

class DescribesExtraLinesMatcher<A, T> extends BaseMatcher<Matcher<A, T>, ReadonlyArray<DescriptionLine>> {
  private readonly _expectedExtraLines: ReadonlyArray<DescriptionLine>;
  private readonly _data: T;

  public constructor(_expectedExtraLines: ReadonlyArray<DescriptionLine>, _data: T) {
    super();
    this._expectedExtraLines = _expectedExtraLines;
    this._data = _data;
  }

  public match(matcher: Matcher<A, T>): MatchResult<ReadonlyArray<DescriptionLine>> {
    const builder = new DescriptionBuilder("expected", "actual");
    matcher.describeResult(this._data, builder);
    const actualExtraLines = builder.extraLines;
    return {
      matches: isEqual(this._expectedExtraLines, actualExtraLines),
      data: actualExtraLines,
    };
  }

  public describeExpected(): string {
    return printValue(this._expectedExtraLines);
  }

  public describeActual(matcher: Matcher<A, T>, data: ReadonlyArray<DescriptionLine>): string {
    return printValue(data);
  }
}

export class DescribesExtraLinesBuilder<A, T> {
  private readonly _expectedExtraLines: ReadonlyArray<DescriptionLine>;

  public constructor(expectedExtraLines: ReadonlyArray<DescriptionLine>) {
    this._expectedExtraLines = expectedExtraLines;
  }

  public given(data: T): Matcher<Matcher<A, T>, ReadonlyArray<DescriptionLine>> {
    return new DescribesExtraLinesMatcher<A, T>(this._expectedExtraLines, data);
  }
}

export const describesExtraLinesAs = <A, T>(expectedExtraLines: ReadonlyArray<DescriptionLine>): DescribesExtraLinesBuilder<A, T> =>
  new DescribesExtraLinesBuilder<A, T>(expectedExtraLines);
