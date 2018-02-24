import { BaseMatcher } from "../BaseMatcher";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";

class AllOf<T> extends BaseMatcher<T, never> {
  public constructor(private matchers: Matcher<T, any>[]) {
    super();
  }

  public match(actual: T): MatchResult<never> {
    for (const matcher of this.matchers) {
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
    const expected = this.matchers.map(d => d.describeExpected());
    if (expected.length === 1) {
      return expected[0];
    }

    return `(${expected.join(" and ")})`;
  }
}

export function allOf<T>(...matchers: Matcher<T, any>[]): Matcher<T, never> {
  return new AllOf<T>(matchers);
}
