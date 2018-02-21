import valueIsUndefined = require("lodash.isundefined");

import { DescriptionBuilder } from "./Description";
import { Matcher } from "./Matcher";
import { Diff } from "./MatchResult";

export class AssertionError extends Error {
  public showDiff: boolean;
  public expected?: any;
  public actual?: any;

  public constructor(message: string, diff?: Diff) {
    super(message);
    if (diff) {
      this.showDiff = true;
      this.expected = diff.expected;
      this.actual = diff.actual;
    } else {
      this.showDiff = false;
    }
  }
}

export function assertThat<A, T>(actual: A, matcher: Matcher<A, T>): void {
  const matchResult = matcher.match(actual);
  if (matchResult.matches) {
    return;
  }
  const builder = new DescriptionBuilder(
    matcher.describeExpected(),
    matcher.describeActual(actual),
  );

  const matchData = matchResult.data;
  if (!valueIsUndefined(matchData)) {
    matcher.describeResult(matchData, builder);
  }

  const message = builder.build();
  const error = new AssertionError(message, matchResult.diff);

  if (error.stack) {
    const stackWithoutMessagePrepended = error.stack.slice(error.stack.indexOf(message) + message.length + 1);
    error.stack = stackWithoutMessagePrepended.replace(/^.*\r?\n/g, "");
  }

  throw error;
}
