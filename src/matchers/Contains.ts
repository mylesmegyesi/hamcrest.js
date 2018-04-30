import { EOL } from "os";

import { BaseMatcher } from "../BaseMatcher";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { printArray, printValue } from "../Printing";

class ContainsMatcher<T> extends BaseMatcher<Iterable<T>, never> {
  private readonly _matchers: ReadonlyArray<Matcher<T, any>>;

  public constructor(matchers: ReadonlyArray<Matcher<T, any>>) {
    super();
    this._matchers = matchers;
  }

  public match(actual: Iterable<T>): MatchResult<never> {
    const unmatched = this._matchers.slice(0);

    for (const item of actual) {
      for (const [i, matcher] of unmatched.entries()) {
        if (matcher.match(item).matches) {
          unmatched.splice(i, 1);
          break;
        }
      }

      if (unmatched.length === 0) {
        return { matches: true };
      }
    }

    return { matches: false };
  }

  public describeExpected(): string {
    const matcherDescriptions = printArray(
      this._matchers,
      matcher => matcher.describeExpected(),
      true,
    );

    return `an Iterable containing:${EOL}${matcherDescriptions}`;
  }

  public describeActual(actual: Iterable<T>, data: never): string {
    return printArray(actual, printValue, true);
  }
}

export const contains = <T>(...matchers: Matcher<T, any>[]): Matcher<Iterable<T>, never> => new ContainsMatcher<T>(matchers);
