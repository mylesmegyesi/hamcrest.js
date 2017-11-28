import { MatchResult } from "./MatchResult";

export interface Matcher<T> {
  match(actual: T): MatchResult;
}
