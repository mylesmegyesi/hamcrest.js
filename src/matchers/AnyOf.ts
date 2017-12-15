import { DescriptionBuilder } from "../DescriptionBuilder";
import { Matcher } from "../Matcher";
import { Description, FailedMatchResult, MatchResult } from "../MatchResult";
import { printValue } from "../Printing";

class AnyOf<T> implements Matcher<T> {
  public constructor(private matchers: Matcher<T>[]) {}

  public match(actual: T): MatchResult {
    const descriptions: Description[] = [];
    const failureResults: FailedMatchResult[] = [];
    let matches = false;

    for (const matcher of this.matchers) {
      const result = matcher.match(actual);
      descriptions.push(result.description);
      if (result.matches) {
        matches = true;
      } else {
        failureResults.push(result);
      }
    }

    const description = descriptions.length === 1
      ? descriptions[0]
      : DescriptionBuilder()
        .setExpected(`(${descriptions.map(d => d.expected).join(" or ")})`)
        .setActual(printValue(actual))
        .build();

    if (matches) {
      return {
        matches: true,
        description,
      };
    }

    if (failureResults.length === 1) {
      return failureResults[0];
    }

    return {
      matches: false,
      description,
    };
  }
}

export function anyOf<T>(...matchers: Matcher<T>[]): Matcher<T> {
  return new AnyOf(matchers);
}
