import { FailedMatchResult, Matcher, MatchResult } from "../src";

export class MockMatcher<T> implements Matcher<T> {
  public actual: T;
  public matchCalledCount: number = 0;

  public constructor(private matchResult: MatchResult) {}

  public match(actual: T): MatchResult {
    this.actual = actual;
    this.matchCalledCount += 1;
    return this.matchResult;
  }
}

export function mockMatcherThatMatches<T>(): MockMatcher<T> {
  return new MockMatcher({ matches: true });
}

export function mockMatcherThatFails<T>(result: FailedMatchResult): MockMatcher<T> {
  return new MockMatcher(result);
}
