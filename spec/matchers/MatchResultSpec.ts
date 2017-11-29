import { Description, FailedMatchResult, matcherDoesNotMatch, matcherMatches } from "../../src";
import { assertEqual, assertSame, assertTrue } from "../BootstrapAssertions";
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

      assertTrue(result.matches);
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

      assertTrue(result.matches);
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

      assertTrue(result.matches);
      assertSame(1, resultMatcher.matchCalledCount);
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

      assertSame(result, resultMatcherResult);
    });
  });
});
