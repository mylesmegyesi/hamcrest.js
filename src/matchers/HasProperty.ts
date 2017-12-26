import { EOL } from "os";

import { DescriptionBuilder } from "../DescriptionBuilder";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { indent, isMultiLine, printValue } from "../Printing";

import { anything } from "./Anything";

class HasProperty<T, K extends keyof T> implements Matcher<T> {
  public constructor(private property: keyof T, private valueMatcher: Matcher<T[K]>) {}

  public match(actual: T): MatchResult {
    if (actual.hasOwnProperty(this.property)) {
      const valueMatchResult = this.valueMatcher.match(actual[this.property]);
      const description = DescriptionBuilder()
        .setExpected(
          isMultiLine(valueMatchResult.description.expected)
            ? `${this.describeExpectedProperty()} matching:${EOL}${indent(valueMatchResult.description.expected, 2)}`
            : `${this.describeExpectedProperty()} matching ${valueMatchResult.description.expected}`,
        )
        .setActual(printValue(actual))
        .build();
      if (valueMatchResult.matches) {
        return {
          matches: true,
          description,
        };
      } else {
        return {
          matches: false,
          description,
          diff: valueMatchResult.diff,
        };
      }
    } else {
      return {
        matches: false,
        description: DescriptionBuilder()
          .setExpected(this.describeExpectedProperty())
          .setActual(printValue(actual))
          .build(),
      };
    }
  }

  private describeExpectedProperty(): string {
    return `an object with property "${this.property}"`;
  }
}

export function hasProperty<T, K extends keyof T>(property: K, valueMatcher: Matcher<T[K]> = anything()): Matcher<T> {
  return new HasProperty<T, K>(property, valueMatcher);
}
