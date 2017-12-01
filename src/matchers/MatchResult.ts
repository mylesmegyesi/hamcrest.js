import { DescriptionBuilder } from "../DescriptionBuilder";
import { Matcher } from "../Matcher";
import { FailedMatchResult, MatchResult } from "../MatchResult";

import { anything } from "./Anything";

class MatchResultMatches implements Matcher<MatchResult> {
  public match(actual: MatchResult): MatchResult {
    if (actual.matches) {
      return { matches: true };
    } else {
      return {
        matches: false,
        description: new DescriptionBuilder()
          .appendToExpected("matcher to match")
          .setActualLabel("but")
          .appendToActual("it didn't")
          .build(),
      };
    }
  }
}

class MatchResultFailed implements Matcher<MatchResult> {
  public constructor(private resultMatcher: Matcher<FailedMatchResult>) {}

  public match(actual: MatchResult): MatchResult {
    if (actual.matches) {
      return {
        matches: false,
        description: new DescriptionBuilder()
          .appendToExpected("matcher not to match")
          .setActualLabel("but")
          .appendToActual("it did")
          .build(),
      };
    } else {
      return this.resultMatcher.match(actual);
    }
  }
}

export function matcherMatches(): Matcher<MatchResult> {
  return new MatchResultMatches();
}

export function matcherDoesNotMatch(resultMatcher: Matcher<FailedMatchResult> = anything()): Matcher<MatchResult> {
  return new MatchResultFailed(resultMatcher);
}
