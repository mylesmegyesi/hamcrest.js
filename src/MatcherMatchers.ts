import valueEquals = require("lodash.isequal");
import { EOL } from "os";

import { Diff, Matcher, MatchResult, MatchResultBuilder, printValue } from ".";
import { BaseMatcher } from "./BaseMatcher";
import { DescriptionBuilder, DescriptionLine } from "./Description";

export class MatcherMatchesBuilder<A, T> {
  private _expectedDiff: Diff | undefined;
  private _expectedData: T | undefined;

  public constructor(private readonly _expectedMatch: boolean) {}

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
  public constructor(private readonly _actual: A,
                     private readonly _expectedResult: MatchResult<T>) {
    super();
  }

  public match(matcher: Matcher<A, T>): MatchResult<MatchResult<T>> {
    const result = matcher.match(this._actual);

    return {
      matches: valueEquals(this._expectedResult, result),
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

export function matcherMatches<A, T = never>(): MatcherMatchesBuilder<A, T> {
  return new MatcherMatchesBuilder<A, T>(true);
}

export function matcherFails<A, T = never>(): MatcherMatchesBuilder<A, T> {
  return new MatcherMatchesBuilder<A, T>(false);
}

class MatcherDescribesExpected<A, T> extends BaseMatcher<Matcher<A, T>, string> {
  public constructor(private readonly _expected: string) {
    super();
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

export function matcherDescribesExpectedAs<A, T>(expected: string): Matcher<Matcher<A, T>, string> {
  return new MatcherDescribesExpected<A, T>(expected);
}

export class MatcherDescribesActualBuilder<A> {
  public constructor(private readonly _expected: string) {}

  public given(actual: A): Matcher<Matcher<A, never>, string> {
    // tslint:disable-next-line no-use-before-declare //
    return new MatcherDescribesActual<A, never>(actual, undefined as never, this._expected);
  }
}

export class MatcherDescribesActual<A, T> extends BaseMatcher<Matcher<A, T>, string> {
  public constructor(private readonly _actual: A,
                     private readonly _data: T,
                     private readonly _expected: string) {
    super();
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

export function matcherDescribesActualAs<A>(expected: string): MatcherDescribesActualBuilder<A> {
  return new MatcherDescribesActualBuilder<A>(expected);
}

class DescribesExtraLinesMatcher<A, T> extends BaseMatcher<Matcher<A, T>, ReadonlyArray<DescriptionLine>> {
  public constructor(private readonly _expectedExtraLines: ReadonlyArray<DescriptionLine>,
                     private readonly _data: T) {
    super();
  }

  public match(matcher: Matcher<A, T>): MatchResult<ReadonlyArray<DescriptionLine>> {
    const builder = new DescriptionBuilder("expected", "actual");
    matcher.describeResult(this._data, builder);
    const actualExtraLines = builder.extraLines;
    return {
      matches: valueEquals(this._expectedExtraLines, actualExtraLines),
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
  public constructor(private readonly _expectedExtraLines: ReadonlyArray<DescriptionLine>) {}

  public given(data: T): Matcher<Matcher<A, T>, ReadonlyArray<DescriptionLine>> {
    return new DescribesExtraLinesMatcher<A, T>(this._expectedExtraLines, data);
  }
}

export function describesExtraLinesAs<A, T>(expectedExtraLines: ReadonlyArray<DescriptionLine>): DescribesExtraLinesBuilder<A, T> {
  return new DescribesExtraLinesBuilder<A, T>(expectedExtraLines);
}
