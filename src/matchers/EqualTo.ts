import { DescriptionBuilder } from "../DescriptionBuilder";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { printValue } from "../Printing";

export type EqualityTester<E, A> = (expected: E, actual: A) => boolean;

class EqualTo<E, A> implements Matcher<A> {
  public constructor(private expected: E,
                     private test: EqualityTester<E, A>) {}

  public match(actual: A): MatchResult {
    if (this.test(this.expected, actual)) {
      return { matches: true };
    } else {
      return {
        matches: false,
        description: new DescriptionBuilder()
          .appendToExpected(printValue(this.expected))
          .setActualLabel("got")
          .appendToActual(printValue(actual))
          .build(),
        diff: {
          expected: this.expected,
          actual,
        },
      };
    }
  }
}

export function equalTo<E, A>(expected: E, test: EqualityTester<E, A>): Matcher<A> {
  return new EqualTo<E, A>(expected, test);
}
