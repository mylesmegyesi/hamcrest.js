import { EOL } from "os";

import { BaseMatcher } from "../BaseMatcher";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { isMultiLine } from "../Printing";

class HasProperty<T, K extends keyof T> extends BaseMatcher<T, never> {
  private readonly _property: K;
  private readonly _valueMatcher?: Matcher<T[K], any>;

  public constructor(property: K, valueMatcher?: Matcher<T[K], any>) {
    super();
    this._property = property;
    this._valueMatcher = valueMatcher;
  }

  public match(actual: T): MatchResult<never> {
    return {
      matches: actual.hasOwnProperty(this._property) && (
        this._valueMatcher
        ? this._valueMatcher.match(actual[this._property]).matches
        : true
      ),
    };
  }

  public describeExpected(): string {
    const propertyDescription = `an object with property "${this._property}"`;
    if (!this._valueMatcher) {
      return propertyDescription;
    }

    const expectedValue = this._valueMatcher.describeExpected();
    return isMultiLine(expectedValue)
      ? `${propertyDescription} matching:${EOL}${expectedValue}`
      : `${propertyDescription} matching ${expectedValue}`;
  }
}

export const hasProperty = <T, K extends keyof T>(property: K, valueMatcher?: Matcher<T[K], any>): Matcher<T, never> =>
  new HasProperty<T, K>(property, valueMatcher);
