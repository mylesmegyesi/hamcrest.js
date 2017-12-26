import { EOL } from "os";

import { DescriptionBuilder } from "../DescriptionBuilder";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { printObject, printValue } from "../Printing";

import { buildObjectDescriptionsPrinter, ObjectDescriptions } from "./ObjectDescriptions";
import { ObjectMatchers } from "./ObjectMatchers";

class ContainsObject<T> implements Matcher<T> {
  public constructor(private expected: Partial<ObjectMatchers<T>>) {}

  public match(actual: T): MatchResult {
    const expectedDescription: Partial<ObjectDescriptions<T>> = {};
    const missing: Partial<ObjectDescriptions<T>> = {};
    const failures: Partial<ObjectDescriptions<T>> = {};

    for (const key in this.expected) {
      if (!this.expected.hasOwnProperty(key)) {
        continue;
      }

      const propertyMatcher = this.expected[key]!;
      const propertyResult = propertyMatcher.match(actual[key]);

      expectedDescription[key] = propertyResult.description.expected;

      if (!actual.hasOwnProperty(key)) {
        missing[key] = propertyResult.description.expected;
      } else if (!propertyResult.matches) {
        failures[key] = propertyResult.description.actual;
      }
    }

    const printDescriptions = buildObjectDescriptionsPrinter<T>();

    const descriptionBuilder = DescriptionBuilder()
      .setExpected(`an object containing:${EOL}${printObject(expectedDescription, printDescriptions)}`)
      .setActual(printValue(actual));

    let matches: boolean = true;

    if (Object.keys(failures).length > 0) {
      matches = false;
      descriptionBuilder.addLine("failures", printObject(failures, printDescriptions));
    }

    if (Object.keys(missing).length > 0) {
      matches = false;
      descriptionBuilder.addLine("missing", printObject(missing, printDescriptions));
    }

    const description = descriptionBuilder.build();

    if (matches) {
      return {
        matches: true,
        description,
      };
    } else {
      return {
        matches: false,
        description,
      };
    }
  }
}

export function containsObject<T>(expected: Partial<ObjectMatchers<T>>): Matcher<T> {
  return new ContainsObject<T>(expected);
}
