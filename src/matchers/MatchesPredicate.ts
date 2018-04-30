import { BaseMatcher } from "../BaseMatcher";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { printValue } from "../Printing";

export type MatcherPredicate<E, A> = (expected: E, actual: A) => boolean;

class MatchesPredicate<E, A> extends BaseMatcher<A, never> {
  private readonly _expected: E;
  private readonly _predicate: MatcherPredicate<E, A>;

  public constructor(expected: E, predicate: MatcherPredicate<E, A>) {
    super();
    this._expected = expected;
    this._predicate = predicate;
  }

  public match(actual: A): MatchResult<never> {
    return {
      matches: this._predicate(this._expected, actual),
      diff: {
        expected: this._expected,
        actual,
      },
    };
  }

  public describeExpected(): string {
    return printValue(this._expected);
  }
}

export const matches = <E, A>(expected: E, predicate: MatcherPredicate<E, A>): Matcher<A, never> => new MatchesPredicate<E, A>(expected, predicate);
