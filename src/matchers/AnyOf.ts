import { DescriptionBuilder } from "../DescriptionBuilder";
import { Matcher } from "../Matcher";
import { FailedMatchResult, MatchResult } from "../MatchResult";

class AnyOf<T> implements Matcher<T> {
  public constructor(private matchers: Matcher<T>[]) {}

  public match(actual: T): MatchResult {
    const failureResults: FailedMatchResult[] = [];

    for (const matcher of this.matchers) {
      const result = matcher.match(actual);
      if (result.matches) {
        return { matches: true };
      } else {
        failureResults.push(result);
      }
    }

    const firstFailureResult: FailedMatchResult | undefined = failureResults[0];

    if (!firstFailureResult) {
      return { matches: true };
    }

    if (failureResults.length === 1) {
      return firstFailureResult;
    }

    return {
      matches: false,
      description: new DescriptionBuilder()
        .appendToExpected(failureResults.map(f => f.description.expected).join(" or "))
        .appendToActual(firstFailureResult.description.actual)
        .build(),
    };
  }
}

export function anyOf<T>(...matchers: Matcher<T>[]): Matcher<T> {
  return new AnyOf(matchers);
}
