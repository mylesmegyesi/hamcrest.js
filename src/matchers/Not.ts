import { DescriptionBuilder } from "../Description";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";

class Not<T> implements Matcher<T> {
  public constructor(private matcher: Matcher<T>) {}

  public match(actual: T): MatchResult {
    const result = this.matcher.match(actual);
    return { matches: !result.matches };
  }

  public describeExpected(): string {
    return `not ${this.matcher.describeExpected()}`;
  }

  public describeActual(actual: T): string {
    return this.matcher.describeActual(actual);
  }

  public describeResult(data: any, builder: DescriptionBuilder): void {}
}

export function not<T>(matcher: Matcher<T>): Matcher<T> {
  return new Not(matcher);
}
