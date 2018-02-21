import { DescriptionBuilder } from "./Description";
import { MatchResult } from "./MatchResult";

export interface Matcher<A, T = any> {
  match(actual: A): MatchResult<T>;
  describeExpected(): string;
  describeActual(actual: A): string;
  describeResult(data: T, builder: DescriptionBuilder): void;
}
