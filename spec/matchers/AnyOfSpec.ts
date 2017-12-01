import {
  anyOf,
  assertThat,
  FailedMatchResult,
  is,
  matcherDoesNotMatch,
  matcherMatches,
  strictlyEqualTo,
} from "../../src";
import { assertEqual } from "../BootstrapAssertions";
import { mockMatcherThatFails, mockMatcherThatMatches } from "../MockMatcher";

describe("AnyOf", () => {
  it("matches if any of the matchers match", () => {
    const failureResult: FailedMatchResult = {
      matches: false,
      description: {
        expectedLabel: "e",
        expected: "1",
        actualLabel: "a",
        actual: "2",
      },
    };
    const matcher1 = mockMatcherThatFails(failureResult);
    const matcher2 = mockMatcherThatMatches();
    const matcher3 = mockMatcherThatFails(failureResult);

    const anyOfMatcher = anyOf(matcher1, matcher2, matcher3);

    assertThat(anyOfMatcher.match("actual"), matcherMatches());

    assertThat(matcher1.matchCalledCount, is(1));
    assertThat(matcher1.actual, is("actual"));
    assertThat(matcher2.matchCalledCount, is(1));
    assertThat(matcher2.actual, is("actual"));
    assertThat(matcher3.matchCalledCount, is(0));
  });

  it("matches if no matchers are given", () => {
    const anyOfMatcher = anyOf();

    assertThat(anyOfMatcher.match("actual"), matcherMatches());
  });

  it("fails if all the matchers fail", () => {
    const matcher1 = mockMatcherThatFails({
      matches: false,
      description: {
        expectedLabel: "e",
        expected: "matcher 1 to match",
        actualLabel: "a",
        actual: "actual",
      },
    });
    const matcher2 = mockMatcherThatFails({
      matches: false,
      description: {
        expectedLabel: "e",
        expected: "matcher 2 to match",
        actualLabel: "a",
        actual: "actual",
      },
    });
    const matcher3 = mockMatcherThatFails({
      matches: false,
      description: {
        expectedLabel: "e",
        expected: "matcher 3 to match",
        actualLabel: "a",
        actual: "actual",
      },
    });

    const anyOfMatcher = anyOf(matcher1, matcher2, matcher3);

    const anyOfResult = anyOfMatcher.match("actual");

    assertThat(anyOfResult, matcherDoesNotMatch());

    assertEqual(anyOfResult, {
      matches: false,
      description: {
        expectedLabel: "Expected",
        expected: "matcher 1 to match or matcher 2 to match or matcher 3 to match",
        actualLabel: "got",
        actual: "actual",
      },
    });
    assertThat(matcher1.matchCalledCount, is(1));
    assertThat(matcher1.actual, is("actual"));
    assertThat(matcher2.matchCalledCount, is(1));
    assertThat(matcher2.actual, is("actual"));
    assertThat(matcher3.matchCalledCount, is(1));
    assertThat(matcher3.actual, is("actual"));
  });

  it("uses the actual from the first failed matcher", () => {
    const matcher1 = mockMatcherThatFails({
      matches: false,
      description: {
        expectedLabel: "e",
        expected: "matcher 1 to match",
        actualLabel: "a",
        actual: "1",
      },
    });
    const matcher2 = mockMatcherThatFails({
      matches: false,
      description: {
        expectedLabel: "e",
        expected: "matcher 2 to match",
        actualLabel: "a",
        actual: "2",
      },
    });

    const anyOfMatcher = anyOf(matcher1, matcher2);

    const anyOfResult = anyOfMatcher.match("actual");

    assertThat(anyOfResult, matcherDoesNotMatch());

    assertEqual(anyOfResult, {
      matches: false,
      description: {
        expectedLabel: "Expected",
        expected: "matcher 1 to match or matcher 2 to match",
        actualLabel: "got",
        actual: "1",
      },
    });
  });

  it("returns the first matcher's failure result if there is only one matcher given", () => {
    const expectedFailureResult: FailedMatchResult = {
      matches: false,
      description: {
        expectedLabel: "e",
        expected: "matcher 1 to match",
        actualLabel: "a",
        actual: "1",
      },
    };
    const matcher = mockMatcherThatFails(expectedFailureResult);

    const anyOfMatcher = anyOf(matcher);

    const anyOfResult = anyOfMatcher.match("actual");

    assertThat(anyOfResult, matcherDoesNotMatch(strictlyEqualTo(expectedFailureResult)));
  });
});
