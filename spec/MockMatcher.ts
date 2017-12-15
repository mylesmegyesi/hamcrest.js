import { Matcher, MatchResult } from "../src";

export class MockMatcher<T> implements Matcher<T> {
  public actual: T;
  public matchCalledCount: number = 0;

  public constructor(public readonly result: MatchResult) {}

  public match(actual: T): MatchResult {
    this.actual = actual;
    this.matchCalledCount += 1;
    return this.result;
  }
}

export function mockMatcher<T>(result: MatchResult): MockMatcher<T> {
  return new MockMatcher(result);
}
