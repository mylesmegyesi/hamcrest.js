import { BaseMatcher } from "../BaseMatcher";
import { DescriptionBuilder } from "../Description";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { ObjectPrinters, printObject, printValue } from "../Printing";

import { buildObjectDescriptionsPrinter, ObjectDescriptions } from "./ObjectDescriptions";
import { ObjectMatchers } from "./ObjectMatchers";

export type ObjectDifferenceAnalysis<T> = {
  failures: Partial<ObjectDescriptions<T>>;
  missing: Partial<ObjectDescriptions<T>>;
  extra: Partial<T>;
};

class MatchesObject<T> extends BaseMatcher<T, ObjectDifferenceAnalysis<T>> {
  private printDescriptions: ObjectPrinters<Partial<ObjectDescriptions<T>>> = buildObjectDescriptionsPrinter<T>();

  public constructor(private expected: ObjectMatchers<T>) {
    super();
  }

  public match(actual: T): MatchResult<ObjectDifferenceAnalysis<T>> {
    const failures: Partial<ObjectDescriptions<T>> = {};
    const missing: Partial<ObjectDescriptions<T>> = {};
    const extra: T = Object.assign({}, actual);

    for (const key in this.expected) {
      if (!this.expected.hasOwnProperty(key)) {
        continue;
      }

      const propertyMatcher = this.expected[key];
      const propertyValue = extra[key];

      delete extra[key];

      if (!actual.hasOwnProperty(key)) {
        missing[key] = propertyMatcher.describeExpected();
      } else if (!propertyMatcher.match(propertyValue).matches) {
        failures[key] = propertyMatcher.describeActual(actual[key]);
      }
    }

    return {
      matches: !((Object.keys(failures).length > 0) || (Object.keys(missing).length > 0) || (Object.keys(extra).length > 0)),
      data: {
        failures,
        missing,
        extra,
      },
    };
  }

  public describeExpected(): string {
    const expectedDescription: Partial<ObjectDescriptions<T>> = {};

    for (const key in this.expected) {
      if (!this.expected.hasOwnProperty(key)) {
        continue;
      }

      const propertyMatcher = this.expected[key];
      expectedDescription[key] = propertyMatcher.describeExpected();
    }

    return printObject(expectedDescription, this.printDescriptions);
  }

  public describeResult(data: ObjectDifferenceAnalysis<T>, builder: DescriptionBuilder): void {
    builder
      .addExtraLine("failures", printObject(data.failures, this.printDescriptions))
      .addExtraLine("missing", printObject(data.missing, this.printDescriptions))
      .addExtraLine("extra", printValue(data.extra));
  }
}

export function matchesObject<T>(expected: ObjectMatchers<T>): Matcher<T, ObjectDifferenceAnalysis<T>> {
  return new MatchesObject<T>(expected);
}
