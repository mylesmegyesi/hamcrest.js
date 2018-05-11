import { assertThat, isPresent } from "../../src";
import {
  matcherDescribesActualAs,
  matcherDescribesExpectedAs,
  matcherFails,
  matcherMatches,
} from "../../src/MatcherMatchers";
import { describeActualCalled, MockMatcher } from "../../src/MockMatcher";

describe("IsPresent", () => {
  it("matches if the value is not null or undefined", () => {
    assertThat(isPresent<number>(), matcherMatches<number>().given(1));
  });

  it("fails if the value is null", () => {
    assertThat(isPresent<number>(), matcherFails<number | null>().given(null));
  });

  it("fails if the value is undefined", () => {
    assertThat(isPresent<number>(), matcherFails<number | undefined>().given(undefined));
  });

  it("matches if the value is not null or undefined and the value matcher matches", () => {
    const matcher = isPresent<number>(
      MockMatcher.builder()
        .setMatches(true)
        .setDiff({ expected: 1, actual: 1 })
        .build(),
    );

    assertThat(matcher, matcherMatches<number | undefined>().andReturnsDiff({
      actual: 1,
      expected: 1,
    }).given(1));
  });

  it("fails if the value is not null or undefined and the value matcher fails", () => {
    const matcher = isPresent<number>(
      MockMatcher.builder()
        .setMatches(false)
        .setDiff({ expected: 2, actual: 1 })
        .build(),
    );

    assertThat(matcher, matcherFails<number | undefined>().andReturnsDiff({
      actual: 1,
      expected: 2,
    }).given(1));
  });

  it("describes the expected with no value matcher", () => {
    const matcher = isPresent<number>();

    assertThat(matcher, matcherDescribesExpectedAs("not (null or undefined)"));
  });

  it("describes the expected with value matcher", () => {
    const matcher = isPresent<number>(
      MockMatcher.builder()
        .setExpected("expected value")
        .build(),
    );

    assertThat(matcher, matcherDescribesExpectedAs("expected value"));
  });

  it("describes the actual by printing the value when no value matcher", () => {
    const matcher = isPresent<number>();

    assertThat(matcher, matcherDescribesActualAs<number>("1").given(1));
    assertThat(matcher, matcherDescribesActualAs<number | null>("null").given(null));
    assertThat(matcher, matcherDescribesActualAs<number | undefined>("undefined").given(undefined));
  });

  it("describes the actual given a value matcher", () => {
    const valueMatcher = MockMatcher.builder<number>()
      .setActual("actual value")
      .build();
    const matcher = isPresent<number>(valueMatcher);

    assertThat(matcher, matcherDescribesActualAs<number>("actual value").given(1));
    assertThat(matcher, matcherDescribesActualAs<number | null>("null").given(null));
    assertThat(matcher, matcherDescribesActualAs<number | undefined>("undefined").given(undefined));

    assertThat(valueMatcher, describeActualCalled({ actual: 1, data: undefined }));
  });
});
