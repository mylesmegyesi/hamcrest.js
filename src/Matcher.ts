import { DescriptionBuilder } from "./Description";
import { MatchResult } from "./MatchResult";

export interface Matcher<A, T> {
  match(actual: A): MatchResult<T>;
  describeExpected(): string;
  describeActual(actual: A, data?: T): string;
  describeResult(data: T, builder: DescriptionBuilder): void;
}
