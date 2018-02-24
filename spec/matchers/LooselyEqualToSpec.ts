import { assertThat, looselyEqualTo } from "../../src";
import {
  matcherDescribesActualAs,
  matcherDescribesExpectedAs,
  matcherFails,
  matcherMatches,
} from "../../src/MatcherMatchers";

describe("LooselyEqualTo", () => {
  it("matches if two objects are loosely equal", () => {
    const expected: string = "";

    const matcher = looselyEqualTo<string, number>(expected);

    assertThat(matcher, matcherMatches().andReturnsDiff({
      expected,
      actual: 0,
    }).given(0));
  });

  it("fails if two objects are not loosely equal", () => {
    const matcher = looselyEqualTo<number, number>(Number.NaN);

    assertThat(matcher, matcherFails().andReturnsDiff({
      expected: Number.NaN,
      actual: Number.NaN,
    }).given(Number.NaN));
  });

  it("describes the expected", () => {
    const matcher = looselyEqualTo<string, number>("0");

    assertThat(matcher, matcherDescribesExpectedAs(`"0"`));
  });

  it("describes the actual", () => {
    const matcher = looselyEqualTo<string, number>("0");

    assertThat(matcher, matcherDescribesActualAs("0").given(0));
  });
});
