import { DescriptionBuilder } from "./Description";
import { Matcher } from "./Matcher";
import { MatchResult } from "./MatchResult";
import { printValue } from "./Printing";

export abstract class BaseMatcher<A, T> implements Matcher<A, T> {
  public abstract match(actual: A): MatchResult<T>;
  public abstract describeExpected(): string;

  public describeActual(actual: A, data: T): string {
    return printValue(actual);
  }

  public describeResult(data: T, builder: DescriptionBuilder): void {}
}
