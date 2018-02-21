import { EOL } from "os";

import valueIsUndefined = require("lodash.isundefined");

import { BaseMatcher } from "../BaseMatcher";
import { DescriptionBuilder } from "../Description";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { ObjectPrinters, printObject } from "../Printing";

import { buildObjectDescriptionsPrinter, ObjectDescriptions } from "./ObjectDescriptions";
import { ObjectMatchers } from "./ObjectMatchers";

export type ObjectDifferenceAnalysis<T> = {
  missing: Partial<ObjectDescriptions<T>>;
  failures: Partial<ObjectDescriptions<T>>;
};

class ContainsObject<T> extends BaseMatcher<T, ObjectDifferenceAnalysis<T>> {
  private printDescriptions: ObjectPrinters<Partial<ObjectDescriptions<T>>> = buildObjectDescriptionsPrinter<T>();

  public constructor(private expected: Partial<ObjectMatchers<T>>) {
    super();
  }

  public match(actual: T): MatchResult<ObjectDifferenceAnalysis<T>> {
    const missing: Partial<ObjectDescriptions<T>> = {};
    const failures: Partial<ObjectDescriptions<T>> = {};

    for (const key in this.expected) {
      if (!this.expected.hasOwnProperty(key)) {
        continue;
      }

      const propertyMatcher = this.expected[key];
      if (valueIsUndefined(propertyMatcher)) {
        continue;
      }

      if (!actual.hasOwnProperty(key)) {
        missing[key] = propertyMatcher.describeExpected();
      } else if (!propertyMatcher.match(actual[key]).matches) {
        failures[key] = propertyMatcher.describeActual(actual[key]);
      }
    }

    return {
      matches: !((Object.keys(failures).length > 0) || (Object.keys(missing).length > 0)),
      data: {
        missing,
        failures,
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
      if (valueIsUndefined(propertyMatcher)) {
        continue;
      }

      expectedDescription[key] = propertyMatcher.describeExpected();
    }

    return `an object containing:${EOL}${printObject(expectedDescription, this.printDescriptions)}`;
  }

  public describeResult(data: ObjectDifferenceAnalysis<T>, builder: DescriptionBuilder): void {
    builder
      .addExtraLine("failures", printObject(data.failures, this.printDescriptions))
      .addExtraLine("missing", printObject(data.missing, this.printDescriptions));
  }
}

export function containsObject<T>(expected: Partial<ObjectMatchers<T>>): Matcher<T, ObjectDifferenceAnalysis<T>> {
  return new ContainsObject<T>(expected);
}
