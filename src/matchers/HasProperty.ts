import { EOL } from "os";

import { BaseMatcher } from "../BaseMatcher";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { isMultiLine } from "../Printing";

class HasProperty<T, K extends keyof T> extends BaseMatcher<T> {
  public constructor(private property: K, private valueMatcher?: Matcher<T[K]>) {
    super();
  }

  public match(actual: T): MatchResult {
    return {
      matches: actual.hasOwnProperty(this.property) && (
        this.valueMatcher
        ? this.valueMatcher.match(actual[this.property]).matches
        : true
      ),
    };
  }

  public describeExpected(): string {
    const propertyDescription = `an object with property "${this.property}"`;
    if (!this.valueMatcher) {
      return propertyDescription;
    }

    const expectedValue = this.valueMatcher.describeExpected();
    return isMultiLine(expectedValue)
      ? `${propertyDescription} matching:${EOL}${expectedValue}`
      : `${propertyDescription} matching ${expectedValue}`;
  }
}

export function hasProperty<T, K extends keyof T>(property: K, valueMatcher?: Matcher<T[K]>): Matcher<T> {
  return new HasProperty<T, K>(property, valueMatcher);
}
