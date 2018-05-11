import { BaseMatcher } from "../BaseMatcher";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";

const ANYTHING = "anything";

export class Anything<T> extends BaseMatcher<T, never> {
  public match(actual: T): MatchResult<never> {
    return { matches: true };
  }

  public describeExpected(): string {
    return ANYTHING;
  }
}

export const anything = <T>(): Matcher<T, never> => new Anything<T>();
