import { DescriptionBuilder } from "../DescriptionBuilder";
import { Matcher } from "../Matcher";
import { MatchResult } from "../MatchResult";

class Not<T> implements Matcher<T> {
  public constructor(private matcher: Matcher<T>) {}

  public match(actual: T): MatchResult {
    const result = this.matcher.match(actual);
    const description = DescriptionBuilder()
      .setExpected(`not ${result.description.expected}`)
      .setActual(result.description.actual)
      .build();
    if (result.matches) {
      return {
        matches: false,
        description,
      };
    } else {
      return {
        matches: true,
        description,
      };
    }
  }
}

export function not<T>(matcher: Matcher<T>): Matcher<T> {
  return new Not(matcher);
}
