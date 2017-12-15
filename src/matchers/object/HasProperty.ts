import { DescriptionBuilder } from "../../DescriptionBuilder";
import { Matcher } from "../../Matcher";
import { MatchResult } from "../../MatchResult";

import { printValue } from "../../Printing";
import { anything } from "../Anything";

class HasProperty<T, K extends keyof T> implements Matcher<T> {
  public constructor(private property: keyof T, private valueMatcher: Matcher<T[K]>) {}

  public match(actual: T): MatchResult {
    if (this.property in actual) {
      const valueMatchResult = this.valueMatcher.match(actual[this.property]);
      if (valueMatchResult.matches) {
        return valueMatchResult;
      } else {
        return {
          matches: false,
          description: DescriptionBuilder()
            .setExpected(`an object with property "${this.property}" matching ${valueMatchResult.description.expected}`)
            .setActual(printValue(actual))
            .build(),
          diff: valueMatchResult.diff,
        };
      }
    } else {
      return {
        matches: false,
        description: DescriptionBuilder()
          .setExpected(`an object with property "${this.property}"`)
          .setActual(printValue(actual))
          .build(),
      };
    }
  }
}

export function hasProperty<T, K extends keyof T>(property: K, valueMatcher: Matcher<T[K]> = anything()): Matcher<T> {
  return new HasProperty<T, K>(property, valueMatcher);
}
