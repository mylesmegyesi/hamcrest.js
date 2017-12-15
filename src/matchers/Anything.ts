import { DescriptionBuilder } from "../DescriptionBuilder";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";
import { printValue } from "../Printing";

const ANYTHING: string = "anything";

export class Anything<T> implements Matcher<T> {
  public match(actual: T): MatchResult {
    return {
      matches: true,
      description: DescriptionBuilder()
        .setExpected(ANYTHING)
        .setActual(printValue(actual))
        .build(),
    };
  }
}

export function anything<T>(): Matcher<T> {
  return new Anything<T>();
}
