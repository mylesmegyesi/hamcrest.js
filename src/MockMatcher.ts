import valueIsEqual = require("lodash.isequal");
import valueIsUndefined = require("lodash.isundefined");
import { EOL } from "os";

import { DescriptionBuilder, Diff, Matcher, MatchResult, MatchResultBuilder, printValue } from ".";
import { BaseMatcher } from "./BaseMatcher";

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
  private _resultBuilder: MatchResultBuilder<T>;

  public constructor() {
    this._resultBuilder = new MatchResultBuilder<T>();
  }

  public setExpected(expected: string): this {
    this._expected = expected;
    return this;
  }

  public setActual(actual: string): this {
    this._actual = actual;
    return this;
  }

  public setMatches(matches: boolean): this {
    this._resultBuilder.setMatches(matches);
    return this;
  }

  public setData(data: T): this {
    this._resultBuilder.setData(data);
    return this;
  }

  public setDiff(diff: Diff): this {
    this._resultBuilder.setDiff(diff);
    return this;
  }

  public build(): MockMatcher<A, T> {
    // tslint:disable-next-line no-use-before-declare //
    return new MockMatcher<A, T>(this._expected, this._actual, this._resultBuilder.build());
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

  private _matchCalledCount: number = 0;
  private _matchArguments: MatchArguments<A> | undefined;
  private _describeExpectedCalledCount: number = 0;
  private _describeActualCalledCount: number = 0;
  private _describeActualArgs: DescribeActualArguments<A, T> | undefined;

  public constructor(private readonly _expectedDescription: string,
                     private readonly _actualDescription: string,
                     private readonly _result: MatchResult<T>) {}

  public get matchCalledCount(): number {
    return this._matchCalledCount;
  }

  public get matchArguments(): MatchArguments<A> | undefined {
    return this._matchArguments;
  }

  public get describeExpectedCalledCount(): number {
    return this._describeExpectedCalledCount;
  }

  public get describeActualCalledCount(): number {
    return this._describeActualCalledCount;
  }

  public get describeActualArgs(): DescribeActualArguments<A, T> | undefined {
    return this._describeActualArgs;
  }

  public match(actual: A): MatchResult<T> {
    this._matchCalledCount += 1;
    this._matchArguments = { actual };

    return this._result;
  }

  public describeExpected(): string {
    this._describeExpectedCalledCount += 1;
    return this._expectedDescription;
  }

  public describeActual(actual: A, data: T): string {
    this._describeActualCalledCount += 1;
    this._describeActualArgs = { actual, data };
    return this._actualDescription;
  }

  public describeResult(data: T, builder: DescriptionBuilder): void {}
}

function describeInvocation(method: string, times: number): string {
  if (times === 0) {
    return `${method} not called`;
  }

  return `${method} called ${times} times`;
}

function describeInvocationWith(method: string, times: number, args?: { [key: string]: any }): string {
  if (times === 0) {
    return `${method} not called`;
  }
  const invocationDescription = describeInvocation(method, times);

  if (valueIsUndefined(args)) {
    return invocationDescription;
  }

  return `${invocationDescription} with:${EOL}${printValue(args)}`;
}

class InvocationMatcher<A, TArgs> extends BaseMatcher<MockMatcher<A, any>, never> {
  public constructor(private readonly _methodName: string,
                     private readonly _getActualCallCount: (matcher: MockMatcher<A, any>) => number,
                     private readonly _getActualArguments: (matcher: MockMatcher<A, any>) => TArgs | undefined,
                     private readonly _expectedCallCount: number,
                     private readonly _expectedArguments: TArgs | undefined) {
    super();
  }

  public match(matcher: MockMatcher<A, any>): MatchResult<never> {
    return {
      matches: this._getActualCallCount(matcher) === this._expectedCallCount &&
      valueIsEqual(this._getActualArguments(matcher), this._expectedArguments),
    };
  }

  public describeExpected(): string {
    return describeInvocationWith(this._methodName, this._expectedCallCount, this._expectedArguments);
  }

  public describeActual(matcher: MockMatcher<A, any>, data: never): string {
    return describeInvocationWith(this._methodName, this._getActualCallCount(matcher), this._getActualArguments(matcher));
  }
}

function buildMatchInvocationMatcher<A>(expectedCallCount: number, expectedArguments?: MatchArguments<A>): Matcher<MockMatcher<A, any>, never> {
  return new InvocationMatcher<A, MatchArguments<A>>(
    "match",
    mockMatcher => mockMatcher.matchCalledCount,
    mockMatcher => mockMatcher.matchArguments,
    expectedCallCount,
    expectedArguments,
  );
}

export class MatchCalledMatcherBuilderEmpty<A> {
  public times(times: number): MatchCalledMatcherBuilderWithTimes<A> {
    // tslint:disable-next-line no-use-before-declare //
    return new MatchCalledMatcherBuilderWithTimes<A>(times);
  }

  public with(actual: A): MatchCalledMatcherBuilderWithExpectedArguments<A> {
    // tslint:disable-next-line no-use-before-declare //
    return new MatchCalledMatcherBuilderWithExpectedArguments<A>({ actual });
  }
}

export class MatchCalledMatcherBuilderWithTimes<A> {
  public constructor(private _times: number) {}

  public times(times: number): this {
    this._times = times;
    return this;
  }

  public with(actual: A): Matcher<MockMatcher<A, any>, never> {
    return buildMatchInvocationMatcher(this._times, { actual });
  }
}

export class MatchCalledMatcherBuilderWithExpectedArguments<A> {
  public constructor(private _expectedArguments: MatchArguments<A>) {}

  public times(times: number): Matcher<MockMatcher<A, any>, never> {
    return buildMatchInvocationMatcher(times, this._expectedArguments);
  }

  public with(actual: A): this {
    this._expectedArguments = { actual };
    return this;
  }
}

export function matchCalled<A>(): MatchCalledMatcherBuilderEmpty<A> {
  return new MatchCalledMatcherBuilderEmpty<A>();
}

export function matchNotCalled<A>(): Matcher<MockMatcher<A, any>, never> {
  return buildMatchInvocationMatcher(0);
}

function buildDescribeExpectedInvocationMatcher<A>(expectedCallCount: number): Matcher<MockMatcher<A, any>, never> {
  return new InvocationMatcher(
    "describeExpected",
    mockMatcher => mockMatcher.describeExpectedCalledCount,
    _ => undefined,
    expectedCallCount,
    undefined,
  );
}

export class DescribeExpectedCalledBuilder<A> {
  public times(times: number): Matcher<MockMatcher<A, any>, never> {
    return buildDescribeExpectedInvocationMatcher(times);
  }
}

export function describeExpectedCalled<A>(): DescribeExpectedCalledBuilder<A> {
  return new DescribeExpectedCalledBuilder<A>();
}

function buildDescribeActualInvocationMatcher<A, T>(expectedCallCount: number, expectedArguments?: DescribeActualArguments<A, T>): Matcher<MockMatcher<A, any>, never> {
  return new InvocationMatcher<A, DescribeActualArguments<A, T>>(
    "describeActual",
    mockMatcher => mockMatcher.describeActualCalledCount,
    mockMatcher => mockMatcher.describeActualArgs,
    expectedCallCount,
    expectedArguments,
  );
}

export class DescribeActualCalledMatcherBuilderEmpty<A, T> {
  public times(times: number): DescribeActualCalledMatcherBuilderWithTimes<A, T> {
    // tslint:disable-next-line no-use-before-declare //
    return new DescribeActualCalledMatcherBuilderWithTimes<A, T>(times);
  }

  public with(actual: A): DescribeActualCalledMatcherBuilderWithJustActualArgument<A, T> {
    // tslint:disable-next-line no-use-before-declare //
    return new DescribeActualCalledMatcherBuilderWithJustActualArgument<A, T>(actual);
  }

  public withData(actual: A, data: T): DescribeActualCalledMatcherBuilderWithExpectedArguments<A, T> {
    // tslint:disable-next-line no-use-before-declare //
    return new DescribeActualCalledMatcherBuilderWithExpectedArguments<A, T>({ actual, data });
  }
}

export class DescribeActualCalledMatcherBuilderWithTimes<A, T> {
  public constructor(private _times: number) {}

  public times(times: number): this {
    this._times = times;
    return this;
  }

  public with(actual: A): Matcher<MockMatcher<A, never>, never> {
    return buildDescribeActualInvocationMatcher(this._times, { actual, data: undefined });
  }

  public withData(actual: A, data: T): Matcher<MockMatcher<A, T>, never> {
    return buildDescribeActualInvocationMatcher(this._times, { actual, data });
  }
}

export class DescribeActualCalledMatcherBuilderWithJustActualArgument<A, T> {
  public constructor(private _actual: A) {}

  public times(times: number): Matcher<MockMatcher<A, never>, never> {
    return buildDescribeActualInvocationMatcher(times, { actual: this._actual, data: undefined });
  }

  public with(actual: A): this {
    this._actual = actual;
    return this;
  }

  public withData(actual: A, data: T): DescribeActualCalledMatcherBuilderWithExpectedArguments<A, T> {
    // tslint:disable-next-line no-use-before-declare //
    return new DescribeActualCalledMatcherBuilderWithExpectedArguments<A, T>({ actual: this._actual, data });
  }
}

export class DescribeActualCalledMatcherBuilderWithExpectedArguments<A, T> {
  public constructor(private _expectedArguments: DescribeActualArguments<A, T>) {}

  public times(times: number): Matcher<MockMatcher<A, never>, never> {
    return buildDescribeActualInvocationMatcher(times, this._expectedArguments);
  }

  public with(actual: A): this {
    this._expectedArguments = {
      ...this._expectedArguments,
      actual,
    };
    return this;
  }

  public withData(actual: A, data: T): this {
    this._expectedArguments = {
      actual,
      data,
    };
    return this;
  }
}

export function describeActualNotCalled<A, T>(): Matcher<MockMatcher<A, T>, never> {
  return buildDescribeActualInvocationMatcher(0);
}

export function describeActualCalled<A, T>(): DescribeActualCalledMatcherBuilderEmpty<A, T> {
  return new DescribeActualCalledMatcherBuilderEmpty();
}
