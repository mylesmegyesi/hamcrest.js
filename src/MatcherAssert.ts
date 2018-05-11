import isString from "lodash.isstring";
import isUndefined from "lodash.isundefined";

import { DescriptionBuilder } from "./Description";
import { Matcher } from "./Matcher";
import { Diff } from "./MatchResult";

export class AssertionError extends Error {
  public actual?: any;
  public expected?: any;
  public showDiff: boolean;

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

export const assertThat = <A, T>(actual: A, matcher: Matcher<A, T>): void => {
  const matchResult = matcher.match(actual);
  if (matchResult.matches) {
    return;
  }
  const builder = new DescriptionBuilder(
    matcher.describeExpected(),
    matcher.describeActual(actual, matchResult.data),
  );

  const matchData = matchResult.data;
  if (!isUndefined(matchData)) {
    matcher.describeResult(matchData, builder);
  }

  const message = builder.build();
  const error = new AssertionError(message, matchResult.diff);

  if (isString(error.stack)) {
    const stackWithoutMessagePrepended = error.stack.slice(error.stack.indexOf(message) + message.length + 1);
    error.stack = stackWithoutMessagePrepended.replace(/^.*\r?\n/g, "");
  }

  throw error;
};
