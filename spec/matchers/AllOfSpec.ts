import {
  allOf,
  assertThat,
  FailedMatchResult,
  is,
  matcherDoesNotMatch,
  matcherMatches,
  strictlyEqualTo,
} from "../../src";
import { mockMatcherThatFails, mockMatcherThatMatches } from "../MockMatcher";

describe("AllOf", () => {
  it("matches if all the matchers match", () => {
    const matcher1 = mockMatcherThatMatches();
    const matcher2 = mockMatcherThatMatches();
    const matcher3 = mockMatcherThatMatches();

    const allOfMatcher = allOf(matcher1, matcher2, matcher3);

    assertThat(allOfMatcher.match("actual"), matcherMatches());

    assertThat(matcher1.matchCalledCount, is(1));
    assertThat(matcher1.actual, is("actual"));
    assertThat(matcher2.matchCalledCount, is(1));
    assertThat(matcher2.actual, is("actual"));
    assertThat(matcher3.matchCalledCount, is(1));
    assertThat(matcher3.actual, is("actual"));
  });

  it("fails if one of the matchers fails", () => {
    const matcher1 = mockMatcherThatMatches();
    const expectedResult: FailedMatchResult = {
      matches: false,
      description: {
        expectedLabel: "e",
        expected: "1",
        actualLabel: "a",
        actual: "2",
      },
    };
    const matcher2 = mockMatcherThatFails(expectedResult);
    const matcher3 = mockMatcherThatMatches();

    const allOfMatcher = allOf(matcher1, matcher2, matcher3);

    assertThat(allOfMatcher.match("actual"), matcherDoesNotMatch(strictlyEqualTo(expectedResult)));

    assertThat(matcher1.matchCalledCount, is(1));
    assertThat(matcher2.matchCalledCount, is(1));
    assertThat(matcher3.matchCalledCount, is(0));
  });
});
