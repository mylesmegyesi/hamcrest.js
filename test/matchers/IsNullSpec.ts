import { assertThat, isNull } from "../../src";
import {
  matcherDescribesActualAs,
  matcherDescribesExpectedAs,
  matcherFails,
  matcherMatches,
} from "../../src/MatcherMatchers";

describe("IsNull", () => {
  it("matches if the value is null", () => {
    assertThat(isNull<number>(), matcherMatches<number | null>().andReturnsDiff({
      expected: null,
      actual: null,
    }).given(null));
  });

  it("fails if the value is not null", () => {
    assertThat(isNull<number>(), matcherFails<number | null>().andReturnsDiff({
      expected: null,
      actual: 1,
    }).given(1));
  });

  it("fails if the value is undefined", () => {
    assertThat(isNull<number>(), matcherFails<number | null | undefined>().andReturnsDiff({
      expected: null,
      actual: undefined,
    }).given(undefined));
  });

  it("describes the expected", () => {
    const matcher = isNull<undefined>();

    assertThat(matcher, matcherDescribesExpectedAs("null"));
  });

  it("describes the actual", () => {
    const matcher = isNull<number>();

    assertThat(matcher, matcherDescribesActualAs<number>("1").given(1));
  });
});
