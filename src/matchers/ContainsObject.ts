import { EOL } from "os";

import isUndefined from "lodash.isundefined";

import { BaseMatcher } from "../BaseMatcher";
import { DescriptionBuilder } from "../Description";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { ObjectPrinters, printObject } from "../Printing";

import { buildObjectDescriptionsPrinter, ObjectDescriptions } from "./ObjectDescriptions";
import { ObjectMatchers } from "./ObjectMatchers";

export type ObjectDifferenceAnalysis<T> = {
  failures: Partial<ObjectDescriptions<T>>;
  missing: Partial<ObjectDescriptions<T>>;
};

class ContainsObject<T> extends BaseMatcher<T, ObjectDifferenceAnalysis<T>> {
  private readonly _expected: Partial<ObjectMatchers<T>>;
  private readonly _printDescriptions: ObjectPrinters<Partial<ObjectDescriptions<T>>> = buildObjectDescriptionsPrinter<T>();

  public constructor(expected: Partial<ObjectMatchers<T>>) {
    super();
    this._expected = expected;
  }

  public match(actual: T): MatchResult<ObjectDifferenceAnalysis<T>> {
    const missing: Partial<ObjectDescriptions<T>> = {};
    const failures: Partial<ObjectDescriptions<T>> = {};

    for (const key in this._expected) {
      if (!this._expected.hasOwnProperty(key)) {
        continue;
      }

      const propertyMatcher = this._expected[key];
      if (isUndefined(propertyMatcher)) {
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

    for (const key in this._expected) {
      if (!this._expected.hasOwnProperty(key)) {
        continue;
      }

      const propertyMatcher = this._expected[key];
      if (isUndefined(propertyMatcher)) {
        continue;
      }

      expectedDescription[key] = propertyMatcher.describeExpected();
    }

    return `an object containing:${EOL}${printObject(expectedDescription, this._printDescriptions)}`;
  }

  public describeResult(data: ObjectDifferenceAnalysis<T>, builder: DescriptionBuilder): void {
    builder
      .addExtraLine("failures", printObject(data.failures, this._printDescriptions))
      .addExtraLine("missing", printObject(data.missing, this._printDescriptions));
  }
}

export const containsObject = <T>(expected: Partial<ObjectMatchers<T>>): Matcher<T, ObjectDifferenceAnalysis<T>> => new ContainsObject<T>(expected);
