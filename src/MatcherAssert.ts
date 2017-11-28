import { descriptionToString } from "./DescriptionPrinter";
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

export function assertThat<T>(actual: T, matcher: Matcher<T>): void {
  const matchResult = matcher.match(actual);
  if (matchResult.matches) {
    return;
  }

  const message = descriptionToString(matchResult.description);
  const error = new AssertionError(message, matchResult.diff);

  if (error.stack) {
    error.stack = error.stack.slice(error.stack.indexOf(message) + 1);
  }

  throw error;
}
