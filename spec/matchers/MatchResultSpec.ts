import {
  assertThat,
  Description,
  FailedMatchResult,
  is,
  isTrue,
  matcherDoesNotMatch,
  matcherMatches,
  strictlyEqualTo,
} from "../../src";
import { assertEqual } from "../BootstrapAssertions";
import { mockMatcherThatFails, mockMatcherThatMatches } from "../MockMatcher";

describe("MatchResult matchers", () => {
  const testDescription: Description = {
    expectedLabel: "Expected",
    expected: "something",
    actualLabel: "got",
    actual: "something else",
  };

  context("matcherMatches", () => {
    it("matches when the match result is a match", () => {
      const matcher = matcherMatches();

      const result = matcher.match({ matches: true });

      assertThat(result.matches, isTrue());
    });

    it("fails when the match result is a not a match", () => {
      const matcher = matcherMatches();

      const result = matcher.match({
        matches: false,
        description: testDescription,
      });

      assertEqual(result, {
        matches: false,
        description: {
          expectedLabel: "Expected",
          expected: "matcher to match",
          actualLabel: "but",
          actual: "it didn't",
        },
      });
    });
  });

  context("matcherDoesNotMatch", () => {
    it("matches when the match result is a not a match", () => {
      const matcher = matcherDoesNotMatch();

      const result = matcher.match({
        matches: false,
        description: testDescription,
      });

      assertThat(result.matches, isTrue());
    });

    it("fails when the match result is a match", () => {
      const matcher = matcherDoesNotMatch();

      const result = matcher.match({ matches: true });

      assertEqual(result, {
        matches: false,
        description: {
          expectedLabel: "Expected",
          expected: "matcher not to match",
          actualLabel: "but",
          actual: "it did",
        },
      });
    });

    it("matches when the match result is a not a match and the resultMatcher matches", () => {
      const resultMatcher = mockMatcherThatMatches();
      const matcher = matcherDoesNotMatch(resultMatcher);

      const actual: FailedMatchResult = {
        matches: false,
        description: testDescription,
      };

      const result = matcher.match(actual);

      assertThat(result.matches, isTrue());
      assertThat(resultMatcher.matchCalledCount, is(1));
      assertEqual(actual, resultMatcher.actual);
    });

    it("fails when the match result is a not a match but the resultMatcher fails", () => {
      const resultMatcherResult: FailedMatchResult = {
        matches: false,
        description: testDescription,
      };
      const resultMatcher = mockMatcherThatFails(resultMatcherResult);
      const matcher = matcherDoesNotMatch(resultMatcher);

      const actual: FailedMatchResult = {
        matches: false,
        description: testDescription,
      };

      const result = matcher.match(actual);

      assertThat(result, strictlyEqualTo(resultMatcherResult));
    });
  });
});
