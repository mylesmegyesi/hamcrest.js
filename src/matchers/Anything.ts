import { BaseMatcher } from "../BaseMatcher";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";

const ANYTHING: string = "anything";

export class Anything<T> extends BaseMatcher<T, never> {
  public match(actual: T): MatchResult<never> {
    return { matches: true };
  }

  public describeExpected(): string {
    return ANYTHING;
  }
}

export function anything<T>(): Matcher<T, never> {
  return new Anything<T>();
}
