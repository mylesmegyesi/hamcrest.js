import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";

import { isAbsent } from "./IsAbsent";
import { not } from "./Not";

class IsPresent<T> implements Matcher<T | null | undefined> {
  public constructor(private notAbsentMatcher: Matcher<T | null | undefined>,
                     private valueMatcher?: Matcher<T>) {}

  public match(actual: T | null | undefined): MatchResult {
    const notAbsentResult = this.notAbsentMatcher.match(actual);
    if (notAbsentResult.matches && this.valueMatcher) {

      // tslint:disable-next-line no-non-null-assertion //
      return this.valueMatcher.match(actual!);
    }

    return notAbsentResult;
  }
}

export function isPresent<T>(matcher?: Matcher<T>): Matcher<T | null | undefined> {
  return new IsPresent(not(isAbsent()), matcher);
}
