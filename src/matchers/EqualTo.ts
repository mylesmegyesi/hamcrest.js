import { DescriptionBuilder } from "../DescriptionBuilder";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { Show, valueToString } from "../ValueToString";

export type EqualityTester<T> = (expected: T, actual: T) => boolean;

class EqualTo<T> implements Matcher<T> {
  public constructor(private expected: T,
                     private test: EqualityTester<T>,
                     private toString: Show<T>) {}

  public match(actual: T): MatchResult {
    if (this.test(this.expected, actual)) {
      return { matches: true };
    } else {
      return {
        matches: false,
        description: new DescriptionBuilder()
          .appendToExpected(this.toString(this.expected))
          .setActualLabel("got")
          .appendToActual(this.toString(actual))
          .build(),
        diff: {
          expected: this.expected,
          actual,
        },
      };
    }
  }
}

export function equalTo<T>(expected: T, test: EqualityTester<T>, toString?: Show<T>): Matcher<T> {
  return new EqualTo<T>(expected, test, toString || valueToString);
}
