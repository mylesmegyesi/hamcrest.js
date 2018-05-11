import { anything, assertThat } from "../../src";
import { matcherDescribesActualAs, matcherDescribesExpectedAs, matcherMatches } from "../../src/MatcherMatchers";

describe("Anything", () => {
  it("always matches", () => {
    const matcher = anything();

    assertThat(matcher, matcherMatches().given(1));
  });

  it("describes expected", () => {
    const matcher = anything();

    assertThat(matcher, matcherDescribesExpectedAs("anything"));
  });

  it("describes actual by printing the value", () => {
    const matcher = anything();

    assertThat(matcher, matcherDescribesActualAs("1").given(1));
  });
});
