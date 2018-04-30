import { BaseMatcher } from "../BaseMatcher";
import { DescriptionBuilder } from "../Description";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { ObjectPrinters, printObject, printValue } from "../Printing";

import { buildObjectDescriptionsPrinter, ObjectDescriptions } from "./ObjectDescriptions";
import { ObjectMatchers } from "./ObjectMatchers";

export type ObjectDifferenceAnalysis<T> = {
  extra: Partial<T>;
  failures: Partial<ObjectDescriptions<T>>;
  missing: Partial<ObjectDescriptions<T>>;
};

class MatchesObject<T> extends BaseMatcher<T, ObjectDifferenceAnalysis<T>> {
  private readonly _expected: ObjectMatchers<T>;
  private readonly _printDescriptions: ObjectPrinters<Partial<ObjectDescriptions<T>>> = buildObjectDescriptionsPrinter<T>();

  public constructor(expected: ObjectMatchers<T>) {
    super();
    this._expected = expected;
  }

  public match(actual: T): MatchResult<ObjectDifferenceAnalysis<T>> {
    const failures: Partial<ObjectDescriptions<T>> = {};
    const missing: Partial<ObjectDescriptions<T>> = {};
    // Object spread does not work with generics yet
    // tslint:disable-next-line prefer-object-spread
    const extra: T = Object.assign({}, actual);

    for (const key in this._expected) {
      if (!this._expected.hasOwnProperty(key)) {
        continue;
      }

      const propertyMatcher = this._expected[key];
      const propertyValue = extra[key];

      // `delete` is OK here, mutating a local copy
      // tslint:disable-next-line no-dynamic-delete
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

    for (const key in this._expected) {
      if (!this._expected.hasOwnProperty(key)) {
        continue;
      }

      const propertyMatcher = this._expected[key];
      expectedDescription[key] = propertyMatcher.describeExpected();
    }

    return printObject(expectedDescription, this._printDescriptions);
  }

  public describeResult(data: ObjectDifferenceAnalysis<T>, builder: DescriptionBuilder): void {
    builder
      .addExtraLine("failures", printObject(data.failures, this._printDescriptions))
      .addExtraLine("missing", printObject(data.missing, this._printDescriptions))
      .addExtraLine("extra", printValue(data.extra));
  }
}

export const matchesObject = <T>(expected: ObjectMatchers<T>): Matcher<T, ObjectDifferenceAnalysis<T>> => new MatchesObject<T>(expected);
