import { DescriptionBuilder } from "../DescriptionBuilder";
import { Matcher } from "../Matcher";
import { Description, MatchResult } from "../MatchResult";
import { printValue } from "../Printing";

class AllOf<T> implements Matcher<T> {
  public constructor(private matchers: Matcher<T>[]) {}

  public match(actual: T): MatchResult {
    const descriptions: Description[] = [];
    for (const matcher of this.matchers) {
      const result = matcher.match(actual);
      descriptions.push(result.description);
      if (!result.matches) {
        return result;
      }
    }
    const description = descriptions.length === 1
      ? descriptions[0]
      : DescriptionBuilder()
        .setExpected(`(${descriptions.map(d => d.expected).join(" and ")})`)
        .setActual(printValue(actual))
        .build();

    return {
      matches: true,
      description,
    };
  }
}

export function allOf<T>(...matchers: Matcher<T>[]): Matcher<T> {
  return new AllOf(matchers);
}
