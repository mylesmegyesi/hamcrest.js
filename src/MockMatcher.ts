import { EOL } from "os";

import isEqual from "lodash.isequal";

import { BaseMatcher } from "./BaseMatcher";
import { DescriptionBuilder } from "./Description";
import { Matcher } from "./Matcher";
import { Diff, MatchResult, MatchResultBuilder } from "./MatchResult";
import { printArray, printValue } from "./Printing";

export type MatchArguments<A> = {
  actual: A;
};

export type DescribeActualArguments<A, T> = {
  actual: A;
  data: T;
};

export class MockMatcherBuilder<A, T> {
  private _expected: string = "";
  private _actual: string = "";
  private _matchesTest?: (actual: A) => boolean;
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
    this._matchesTest = _ => matches;
    return this;
  }

  public setMatchesTest(test: (actual: A) => boolean): this {
    this._matchesTest = test;
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
    return new MockMatcher<A, T>(this._expected, this._actual, this._matchesTest, this._diff, this._data);
  }
}

export class MockMatcher<A, T> implements Matcher<A, T> {
  public static builder<A, T = never>(): MockMatcherBuilder<A, T> {
    return new MockMatcherBuilder<A, T>();
  }

  public static matches<A, T = never>(): MockMatcher<A, T> {
    return MockMatcher.builder<A, T>()
      .setMatches(true)
      .build();
  }

  public static fails<A, T = never>(): MockMatcher<A, T> {
    return MockMatcher.builder<A, T>()
      .setMatches(false)
      .build();
  }

  private _describeExpectedCalledCount: number = 0;
  private readonly _actualDescription: string;
  private readonly _data?: T;
  private readonly _describeActualInvocations: DescribeActualArguments<A, T>[] = [];
  private readonly _diff?: Diff;
  private readonly _expectedDescription: string;
  private readonly _matchInvocations: MatchArguments<A>[] = [];
  private readonly _matchesTest?: (actual: A) => boolean;

  public constructor(
    expectedDescription: string,
    actualDescription: string,
    matchesTest?: (actual: A) => boolean,
    diff?: Diff,
    data?: T,
  ) {
    this._expectedDescription = expectedDescription;
    this._actualDescription = actualDescription;
    this._matchesTest = matchesTest;
    this._diff = diff;
    this._data = data;
  }

  public get matchInvocations(): ReadonlyArray<MatchArguments<A>> {
    return this._matchInvocations;
  }

  public get describeExpectedCalledCount(): number {
    return this._describeExpectedCalledCount;
  }

  public get describeActualInvocations(): ReadonlyArray<DescribeActualArguments<A, T>> {
    return this._describeActualInvocations;
  }

  public match(actual: A): MatchResult<T> {
    this._matchInvocations.push({ actual });

    const builder = new MatchResultBuilder<T>()
      .setData(this._data)
      .setDiff(this._diff);

    if (this._matchesTest) {
      builder.setMatches(this._matchesTest(actual));
    }

    return builder.build();
  }

  public describeExpected(): string {
    this._describeExpectedCalledCount += 1;
    return this._expectedDescription;
  }

  public describeActual(actual: A, data: T): string {
    this._describeActualInvocations.push({ actual, data });
    return this._actualDescription;
  }

  public describeResult(_data: T, _builder: DescriptionBuilder): void {}
}

const printInvocations = <TArgs>(invocations: ReadonlyArray<TArgs>): string =>
  printArray<TArgs>(invocations, printValue, true);

class InvocationMatcher<A, TArgs> extends BaseMatcher<MockMatcher<A, any>, never> {
  private readonly _methodName: string;
  private readonly _getActualInvocations: (matcher: MockMatcher<A, any>) => ReadonlyArray<TArgs>;
  private readonly _expectedInvocations: ReadonlyArray<TArgs>;

  public constructor(
    methodName: string,
    getActualInvocations: (matcher: MockMatcher<A, any>) => ReadonlyArray<TArgs>,
    expectedInvocations: ReadonlyArray<TArgs>,
  ) {
    super();
    this._methodName = methodName;
    this._getActualInvocations = getActualInvocations;
    this._expectedInvocations = expectedInvocations;
  }

  public match(matcher: MockMatcher<A, any>): MatchResult<never> {
    const actual = this._getActualInvocations(matcher);
    return {
      matches: isEqual(actual, this._expectedInvocations),
      diff: {
        expected: this._expectedInvocations,
        actual,
      },
    };
  }

  public describeExpected(): string {
    if (this._expectedInvocations.length === 0) {
      return `${this._methodName} not to have been called`;
    }

    return `${this._methodName} to have been called ${this._expectedInvocations.length} times with:${EOL}${printInvocations(this._expectedInvocations)}`;
  }

  public describeActual(matcher: MockMatcher<A, any>, data: never): string {
    const actualInvocations = this._getActualInvocations(matcher);
    if (actualInvocations.length === 0) {
      return "was not called";
    }

    return `was called with:${EOL}${printInvocations(actualInvocations)}`;
  }
}

class InvocationsCountMatcher<A> extends BaseMatcher<MockMatcher<A, any>, never> {
  private readonly _methodName: string;
  private readonly _getActualCallCount: (matcher: MockMatcher<A, any>) => number;
  private readonly _expectedCallCount: number;

  public constructor(
    methodName: string,
    getActualCallCount: (matcher: MockMatcher<A, any>) => number,
    expectedCallCount: number,
  ) {
    super();
    this._methodName = methodName;
    this._getActualCallCount = getActualCallCount;
    this._expectedCallCount = expectedCallCount;
  }

  public match(matcher: MockMatcher<A, any>): MatchResult<never> {
    const actual = this._getActualCallCount(matcher);
    return {
      matches: actual === this._expectedCallCount,
      diff: {
        expected: this._expectedCallCount,
        actual,
      },
    };
  }

  public describeExpected(): string {
    if (this._expectedCallCount === 0) {
      return `${this._methodName} not to have been called`;
    }

    return `${this._methodName} to have been called ${this._expectedCallCount} times`;
  }

  public describeActual(matcher: MockMatcher<A, any>, data: never): string {
    const actualCallCount = this._getActualCallCount(matcher);
    if (actualCallCount === 0) {
      return "was not called";
    }

    return `was called ${actualCallCount} times`;
  }
}

const buildMatchInvocationMatcher = <A>(expectedInvocations: ReadonlyArray<MatchArguments<A>>): Matcher<MockMatcher<A, any>, never> =>
  new InvocationMatcher<A, MatchArguments<A>>(
    "match",
    mockMatcher => mockMatcher.matchInvocations,
    expectedInvocations,
  );

export const matchCalled = <A>(...invocations: MatchArguments<A>[]): Matcher<MockMatcher<A, any>, never> => buildMatchInvocationMatcher<A>(invocations);

export const matchNotCalled = <A>(): Matcher<MockMatcher<A, any>, never> => buildMatchInvocationMatcher<A>([]);

const buildDescribeExpectedInvocationMatcher = <A>(expectedCallCount: number): Matcher<MockMatcher<A, any>, never> =>
  new InvocationsCountMatcher<A>(
    "describeExpected",
    mockMatcher => mockMatcher.describeExpectedCalledCount,
    expectedCallCount,
  );

export const describeExpectedCalled = buildDescribeExpectedInvocationMatcher;

const buildDescribeActualInvocationMatcher = <A, T>(expectedInvocations: ReadonlyArray<DescribeActualArguments<A, T>>): Matcher<MockMatcher<A, any>, never> =>
  new InvocationMatcher<A, DescribeActualArguments<A, T>>(
    "describeActual",
    mockMatcher => mockMatcher.describeActualInvocations,
    expectedInvocations,
  );

export const describeActualNotCalled = <A, T>(): Matcher<MockMatcher<A, T>, never> => buildDescribeActualInvocationMatcher<A, T>([]);

export const describeActualCalled = <A, T>(...invocations: DescribeActualArguments<A, T>[]): Matcher<MockMatcher<A, T>, never> =>
  buildDescribeActualInvocationMatcher<A, T>(invocations);
