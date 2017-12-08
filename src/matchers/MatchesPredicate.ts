import { DescriptionBuilder } from "../DescriptionBuilder";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { printValue } from "../Printing";

export type MatcherPredicate<E, A> = (expected: E, actual: A) => boolean;

class MatchesPredicate<E, A> implements Matcher<A> {
  public constructor(private expected: E,
                     private predicate: MatcherPredicate<E, A>) {}

  public match(actual: A): MatchResult {
    if (this.predicate(this.expected, actual)) {
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

export function matches<E, A>(expected: E, predicate: MatcherPredicate<E, A>): Matcher<A> {
  return new MatchesPredicate<E, A>(expected, predicate);
}
