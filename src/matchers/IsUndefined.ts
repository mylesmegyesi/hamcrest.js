import valueIsUndefined = require("lodash.isundefined");

import { DescriptionBuilder } from "../DescriptionBuilder";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { printValue } from "../Printing";

const UNDEFINED: string = "undefined";

class IsUndefined<T> implements Matcher<T | undefined> {
  public match(actual: T | undefined): MatchResult {
    const description = DescriptionBuilder()
      .setExpected(UNDEFINED)
      .setActual(printValue(actual))
      .build();

    if (valueIsUndefined(actual)) {
      return {
        matches: true,
        description,
      };
    } else {
      return {
        matches: false,
        description,
        diff: {
          expected: undefined,
          actual,
        },
      };
    }
  }
}

export function isUndefined<T>(): Matcher<T | undefined> {
  return new IsUndefined<T>();
}
