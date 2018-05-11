import { BaseMatcher } from "../BaseMatcher";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";

class AllOf<T> extends BaseMatcher<T, never> {
  private readonly _matchers: Matcher<T, any>[];

  public constructor(matchers: Matcher<T, any>[]) {
    super();
    this._matchers = matchers;
  }

  public match(actual: T): MatchResult<never> {
    for (const matcher of this._matchers) {
      const result = matcher.match(actual);
      if (!result.matches) {
        return result;
      }
    }

    return {
      matches: true,
    };
  }

  public describeExpected(): string {
    const expected = this._matchers.map(d => d.describeExpected());
    if (expected.length === 1) {
      return expected[0];
    }

    return `(${expected.join(" and ")})`;
  }
}

export const allOf = <T>(...matchers: Matcher<T, any>[]): Matcher<T, never> => new AllOf<T>(matchers);
