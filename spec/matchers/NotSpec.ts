import { assertThat, not } from "../../src";
import {
  matcherDescribesActualAs,
  matcherDescribesExpectedAs,
  matcherFails,
  matcherMatches,
} from "../../src/MatcherMatchers";
import { matchCalled, MockMatcher } from "../../src/MockMatcher";

describe("Not", () => {
  it("matches when the given matcher fails", () => {
    const wrappedMatcher = MockMatcher.builder<string, string>()
      .setMatches(false)
      .setDiff({
        expected: 1,
        actual: 2,
      })
      .setData("data")
      .build();
    const matcher = not(wrappedMatcher);

    assertThat(matcher, matcherMatches().given("actual"));

    assertThat(wrappedMatcher, matchCalled({ actual: "actual"}));
  });

  it("fails when the given matcher matches", () => {
    const wrappedMatcher = MockMatcher.builder<string, string>()
      .setMatches(true)
      .setDiff({
        expected: 1,
        actual: 2,
      })
      .setData("data")
      .build();
    const matcher = not(wrappedMatcher);

    assertThat(matcher, matcherFails().given("actual"));
  });

  it("describes the expected", () => {
    const wrappedMatcher = MockMatcher.builder()
      .setExpected("wrapped expected")
      .build();
    const matcher = not(wrappedMatcher);

    assertThat(matcher, matcherDescribesExpectedAs("not wrapped expected"));
  });

  it("describes the actual", () => {
    const wrappedMatcher = MockMatcher.builder()
      .setActual("wrapped actual")
      .build();
    const matcher = not(wrappedMatcher);

    assertThat(matcher, matcherDescribesActualAs("wrapped actual").given("actual"));
  });
});
