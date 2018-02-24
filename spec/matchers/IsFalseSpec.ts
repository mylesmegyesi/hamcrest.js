import { assertThat, isFalse } from "../../src";
import {
  matcherDescribesActualAs,
  matcherDescribesExpectedAs,
  matcherFails,
  matcherMatches,
} from "../../src/MatcherMatchers";

describe("IsFalse", () => {
  it("matches when the actual is false", () => {
    assertThat(isFalse(), matcherMatches().andReturnsDiff({
      expected: false,
      actual: false,
    }).given(false));
  });

  it("fails when the actual is false", () => {
    assertThat(isFalse(), matcherFails().andReturnsDiff({
      expected: false,
      actual: true,
    }).given(true));
  });

  it("describes expected", () => {
    const matcher = isFalse();

    assertThat(matcher, matcherDescribesExpectedAs("false"));
  });

  it("describes the actual by printing the value", () => {
    const matcher = isFalse();

    assertThat(matcher, matcherDescribesActualAs("false").given(false));
    assertThat(matcher, matcherDescribesActualAs("true").given(true));
  });
});
