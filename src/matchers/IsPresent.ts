import valueIsNull = require("lodash.isnull");
import valueIsUndefined = require("lodash.isundefined");

import { BaseMatcher } from "../BaseMatcher";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";

import { isAbsent } from "./IsAbsent";
import { not } from "./Not";

function valueIsPresent<T>(value: T | null | undefined): value is T {
  return !(valueIsNull(value) || valueIsUndefined(value));
}

class IsPresent<T> extends BaseMatcher<T | null | undefined, never> {
  private readonly notAbsentMatcher: Matcher<T | null | undefined, never> = not(isAbsent<T>());

  public constructor(private valueMatcher?: Matcher<T, any>) {
    super();
  }

  public match(actual: T | null | undefined): MatchResult<never> {
    if (!valueIsPresent(actual)) {
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

  public describeActual(actual: T | null | undefined, data: never): string {
    if (valueIsPresent(actual) && this.valueMatcher) {
      return this.valueMatcher.describeActual(actual);
    }

    return this.notAbsentMatcher.describeActual(actual);
  }
}

export function isPresent<T>(matcher?: Matcher<T, any>): Matcher<T | null | undefined, never> {
  return new IsPresent(matcher);
}
