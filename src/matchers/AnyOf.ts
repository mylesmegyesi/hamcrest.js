import { BaseMatcher } from "../BaseMatcher";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";

class AnyOf<T> extends BaseMatcher<T, never> {
  private readonly _matchers: Matcher<T, any>[];

  public constructor(matchers: Matcher<T, any>[]) {
    super();
    this._matchers = matchers;
  }

  public match(actual: T): MatchResult<never> {
    for (const matcher of this._matchers) {
      const result = matcher.match(actual);
      if (result.matches) {
        return { matches: true };
      }
    }

    return { matches: false };
  }

  public describeExpected(): string {
    const descriptions = this._matchers.map(d => d.describeExpected());
    if (descriptions.length === 1) {
      return descriptions[0];
    }

    return `(${descriptions.join(" or ")})`;
  }
}

export const anyOf = <T>(...matchers: Matcher<T, any>[]): Matcher<T, never> => new AnyOf<T>(matchers);
