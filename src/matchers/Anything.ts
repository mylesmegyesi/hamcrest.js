import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";

export class Anything<T> implements Matcher<T> {
  public match(actual: T): MatchResult {
    return { matches: true };
  }
}

export function anything<T>(): Matcher<T> {
  return new Anything<T>();
}
