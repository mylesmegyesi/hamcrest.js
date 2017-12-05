import { DescriptionBuilder } from "../DescriptionBuilder";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { Show, valueToString } from "../ValueToString";

export type EqualityTester<E, A> = (expected: E, actual: A) => boolean;

class EqualTo<E, A> implements Matcher<A> {
  public constructor(private expected: E,
                     private test: EqualityTester<E, A>,
                     private expectedToString: Show<E>,
                     private actualToString: Show<A>) {}

  public match(actual: A): MatchResult {
    if (this.test(this.expected, actual)) {
      return { matches: true };
    } else {
      return {
        matches: false,
        description: new DescriptionBuilder()
          .appendToExpected(this.expectedToString(this.expected))
          .setActualLabel("got")
          .appendToActual(this.actualToString(actual))
          .build(),
        diff: {
          expected: this.expected,
          actual,
        },
      };
    }
  }
}

export function equalTo<E, A>(expected: E, test: EqualityTester<E, A>, expectedToString: Show<E> = valueToString, actualToString: Show<A> = valueToString): Matcher<A> {
  return new EqualTo<E, A>(expected, test, expectedToString, actualToString);
}
