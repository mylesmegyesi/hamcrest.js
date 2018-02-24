import { assertThat, isTrue } from "../../src";
import {
  matcherDescribesActualAs,
  matcherDescribesExpectedAs,
  matcherFails,
  matcherMatches,
} from "../../src/MatcherMatchers";

describe("IsTrue", () => {
  it("matches when the actual is true", () => {
    assertThat(isTrue(), matcherMatches().andReturnsDiff({
      expected: true,
      actual: true,
    }).given(true));
  });

  it("fails when the actual is false", () => {
    assertThat(isTrue(), matcherFails().andReturnsDiff({
      expected: true,
      actual: false,
    }).given(false));
  });

  it("describes the expected", () => {
    assertThat(isTrue(), matcherDescribesExpectedAs("true"));
  });

  it("describes the actual", () => {
    assertThat(isTrue(), matcherDescribesActualAs("true").given(true));
    assertThat(isTrue(), matcherDescribesActualAs("false").given(false));
  });
});
