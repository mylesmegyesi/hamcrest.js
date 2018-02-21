import { BaseMatcher } from "../BaseMatcher";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";

const ANYTHING: string = "anything";

export class Anything<T> extends BaseMatcher<T> {
  public match(actual: T): MatchResult {
    return { matches: true };
  }

  public describeExpected(): string {
    return ANYTHING;
  }
}

export function anything<T>(): Matcher<T> {
  return new Anything<T>();
}
