import valueIsNull = require("lodash.isnull");

import { DescriptionBuilder } from "../DescriptionBuilder";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { printValue } from "../Printing";

const NULL: string = "null";

class IsNull<T> implements Matcher<T | null> {
  public match(actual: T | null): MatchResult {
    const description = DescriptionBuilder()
      .setExpected(NULL)
      .setActual(printValue(actual))
      .build();

    if (valueIsNull(actual)) {
      return {
        matches: true,
        description,
      };
    } else {
      return {
        matches: false,
        description,
        diff: {
          expected: null,
          actual,
        },
      };
    }
  }
}

export function isNull<T>(): Matcher<T | null> {
  return new IsNull<T>();
}
