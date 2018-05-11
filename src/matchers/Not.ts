import { DescriptionBuilder } from "../Description";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";

class Not<T> implements Matcher<T, never> {
  private readonly _matcher: Matcher<T, any>;

  public constructor(matcher: Matcher<T, any>) {
    this._matcher = matcher;
  }

  public match(actual: T): MatchResult<never> {
    const result = this._matcher.match(actual);
    return { matches: !result.matches };
  }

  public describeExpected(): string {
    return `not ${this._matcher.describeExpected()}`;
  }

  public describeActual(actual: T): string {
    return this._matcher.describeActual(actual);
  }

  public describeResult(data: any, builder: DescriptionBuilder): void {}
}

export const not = <T>(matcher: Matcher<T, any>): Matcher<T, never> => new Not(matcher);
