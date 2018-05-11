import { assertThat, isAbsent } from "../../src";
import {
  matcherDescribesActualAs,
  matcherDescribesExpectedAs,
  matcherFails,
  matcherMatches,
} from "../../src/MatcherMatchers";

describe("IsAbsent", () => {
  it("matches if actual is null", () => {
    const matcher = isAbsent<number>();

    assertThat(matcher, matcherMatches<number | null | undefined>().given(null));
  });

  it("matches if actual is undefined", () => {
    const matcher = isAbsent<number>();

    assertThat(matcher, matcherMatches<number | null | undefined>().given(undefined));
  });

  it("fails if the actual is not null or undefined", () => {
    const matcher = isAbsent<number>();

    assertThat(matcher, matcherFails<number | null | undefined>().given(1));
  });

  it("describes the expected", () => {
    const matcher = isAbsent<number>();

    assertThat(matcher, matcherDescribesExpectedAs("(null or undefined)"));
  });

  it("describes the actual by printing the value", () => {
    const matcher = isAbsent<number>();

    assertThat(matcher, matcherDescribesActualAs<number | null | undefined>("1").given(1));
  });
});
