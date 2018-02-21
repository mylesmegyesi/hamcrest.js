import { BaseMatcher } from "../BaseMatcher";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";

class AnyOf<T> extends BaseMatcher<T> {
  public constructor(private matchers: Matcher<T>[]) {
    super();
  }

  public match(actual: T): MatchResult {
    for (const matcher of this.matchers) {
      const result = matcher.match(actual);
      if (result.matches) {
        return { matches: true };
      }
    }

    return { matches: false };
  }

  public describeExpected(): string {
    const descriptions = this.matchers.map(d => d.describeExpected());
    if (descriptions.length === 1) {
      return descriptions[0];
    }

    return `(${descriptions.join(" or ")})`;
  }
}

export function anyOf<T>(...matchers: Matcher<T>[]): Matcher<T> {
  return new AnyOf<T>(matchers);
}
