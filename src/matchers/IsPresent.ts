import isNull from "lodash.isnull";
import isUndefined from "lodash.isundefined";

import { BaseMatcher } from "../BaseMatcher";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";

import { isAbsent } from "./IsAbsent";
import { not } from "./Not";

const valueIsPresent = <T>(value: T | null | undefined): value is T => !(isNull(value) || isUndefined(value));

class IsPresent<T> extends BaseMatcher<T | null | undefined, never> {
  private readonly _notAbsentMatcher: Matcher<T | null | undefined, never> = not<T>(isAbsent<T>());
  private readonly _valueMatcher?: Matcher<T, any>;

  public constructor(valueMatcher?: Matcher<T, any>) {
    super();
    this._valueMatcher = valueMatcher;
  }

  public match(actual: T | null | undefined): MatchResult<never> {
    if (!valueIsPresent(actual)) {
      return {
        matches: false,
      };
    }

    if (this._valueMatcher) {
      return this._valueMatcher.match(actual);
    }

    return {
      matches: true,
    };
  }

  public describeExpected(): string {
    if (this._valueMatcher) {
      return this._valueMatcher.describeExpected();
    } else {
      return this._notAbsentMatcher.describeExpected();
    }
  }

  public describeActual(actual: T | null | undefined, data: never): string {
    if (valueIsPresent(actual) && this._valueMatcher) {
      return this._valueMatcher.describeActual(actual);
    }

    return this._notAbsentMatcher.describeActual(actual);
  }
}

export const isPresent = <T>(matcher?: Matcher<T, any>): Matcher<T | null | undefined, never> => new IsPresent<T>(matcher);
