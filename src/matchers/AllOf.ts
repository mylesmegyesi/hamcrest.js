import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";

class AllOf<T> implements Matcher<T> {
  public constructor(private matchers: Matcher<T>[]) {}

  public match(actual: T): MatchResult {
    for (const matcher of this.matchers) {
      const result = matcher.match(actual);
      if (!result.matches) {
        return result;
      }
    }

    return { matches: true };
  }
}

export function allOf<T>(...matchers: Matcher<T>[]): Matcher<T> {
  return new AllOf(matchers);
}
