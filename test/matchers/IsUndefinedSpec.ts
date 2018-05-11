import { assertThat, isUndefined } from "../../src";
import {
  matcherDescribesActualAs,
  matcherDescribesExpectedAs,
  matcherFails,
  matcherMatches,
} from "../../src/MatcherMatchers";

describe("IsUndefined", () => {
  it("matches if the value is undefined", () => {
    const matcher = isUndefined<number>();

    assertThat(matcher, matcherMatches<number | undefined>().andReturnsDiff({
      actual: undefined,
      expected: undefined,
    }).given(undefined));
  });

  it("fails if the value is not undefined", () => {
    const matcher = isUndefined<number>();

    assertThat(matcher, matcherFails<number | undefined>().andReturnsDiff({
      actual: 1,
      expected: undefined,
    }).given(1));
  });

  it("fails if the value is null", () => {
    const matcher = isUndefined<null>();

    assertThat(matcher, matcherFails<null | undefined>().andReturnsDiff({
      actual: null,
      expected: undefined,
    }).given(null));
  });

  it("describes the expected", () => {
    const matcher = isUndefined<number>();

    assertThat(matcher, matcherDescribesExpectedAs("undefined"));
  });

  it("describes the actual", () => {
    const matcher = isUndefined<number>();

    assertThat(matcher, matcherDescribesActualAs<number | undefined>("1").given(1));
  });
});
