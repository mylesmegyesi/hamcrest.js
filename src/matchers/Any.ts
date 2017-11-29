import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";

export class Any<T> implements Matcher<T> {
  public match(actual: T): MatchResult {
    return { matches: true };
  }
}

export function any<T>(): Matcher<T> {
  return new Any<T>();
}
