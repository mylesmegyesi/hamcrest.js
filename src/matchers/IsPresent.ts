import valueIsNull = require("lodash.isnull");
import valueIsUndefined = require("lodash.isundefined");

import { BaseMatcher } from "../BaseMatcher";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";

import { isAbsent } from "./IsAbsent";
import { not } from "./Not";

class IsPresent<T> extends BaseMatcher<T | null | undefined> {
  public constructor(private notAbsentMatcher: Matcher<T | null | undefined>,
                     private valueMatcher?: Matcher<T>) {
    super();
  }

  public match(actual: T | null | undefined): MatchResult {
    if (valueIsNull(actual) || valueIsUndefined(actual)) {
      return {
        matches: false,
      };
    }

    if (this.valueMatcher) {
      return this.valueMatcher.match(actual);
    }

    return {
      matches: true,
    };
  }

  public describeExpected(): string {
    if (this.valueMatcher) {
      return this.valueMatcher.describeExpected();
    } else {
      return this.notAbsentMatcher.describeExpected();
    }
  }
}

export function isPresent<T>(matcher?: Matcher<T>): Matcher<T | null | undefined> {
  return new IsPresent(not(isAbsent()), matcher);
}
