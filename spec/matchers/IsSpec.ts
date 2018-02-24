import { assertThat, is } from "../../src";
import {
  matcherDescribesActualAs,
  matcherDescribesExpectedAs,
  matcherFails,
  matcherMatches,
} from "../../src/MatcherMatchers";

describe("Is", () => {
  it("matches if Object.is returns true", () => {
    const matcher = is(1);

    assertThat(matcher, matcherMatches().andReturnsDiff({
      expected: 1,
      actual: 1,
    }).given(1));
  });

  it("fails if Object.is returns false", () => {
    const matcher = is(+0);

    assertThat(matcher, matcherFails().andReturnsDiff({
      expected: +0,
      actual: -0,
    }).given(-0));
  });

  it("describes the expected", () => {
    const matcher = is(+0);

    assertThat(matcher, matcherDescribesExpectedAs("0"));
  });

  it("describes the actual", () => {
    const matcher = is(+0);

    assertThat(matcher, matcherDescribesActualAs("-0").given(-0));
  });
});
