import { BaseMatcher } from "../BaseMatcher";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { printValue } from "../Printing";

export type MatcherPredicate<E, A> = (expected: E, actual: A) => boolean;

class MatchesPredicate<E, A> extends BaseMatcher<A, never> {
  public constructor(private expected: E,
                     private predicate: MatcherPredicate<E, A>) {
    super();
  }

  public match(actual: A): MatchResult<never> {
    return {
      matches: this.predicate(this.expected, actual),
      diff: {
        expected: this.expected,
        actual,
      },
    };
  }

  public describeExpected(): string {
    return printValue(this.expected);
  }
}

export function matches<E, A>(expected: E, predicate: MatcherPredicate<E, A>): Matcher<A, never> {
  return new MatchesPredicate<E, A>(expected, predicate);
}
