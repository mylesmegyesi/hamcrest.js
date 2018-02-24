import { anyOf, assertThat } from "../../src";
import {
  matcherDescribesActualAs,
  matcherDescribesExpectedAs,
  matcherFails,
  matcherMatches,
} from "../../src/MatcherMatchers";
import {
  describeActualNotCalled,
  describeExpectedCalled,
  matchCalled,
  matchNotCalled,
  MockMatcher,
} from "../../src/MockMatcher";

describe("AnyOf", () => {
  it("matches if one matchers is given and it matches", () => {
    const matcher = MockMatcher.matches();
    const anyOfMatcher = anyOf(matcher);

    assertThat(anyOfMatcher, matcherMatches().given("actual"));

    assertThat(matcher, matchCalled().with("actual").times(1));
  });

  it("matches if any of the matchers match", () => {
    const matcher1 = MockMatcher.fails();
    const matcher2 = MockMatcher.matches();
    const matcher3 = MockMatcher.fails();
    const anyOfMatcher = anyOf(matcher1, matcher2, matcher3);

    assertThat(anyOfMatcher, matcherMatches().given("actual"));

    assertThat(matcher1, matchCalled().with("actual").times(1));
    assertThat(matcher2, matchCalled().with("actual").times(1));
    assertThat(matcher3, matchNotCalled());
  });

  it("fails if no matchers are given", () => {
    const anyOfMatcher = anyOf();

    assertThat(anyOfMatcher, matcherFails().given("actual"));
  });

  it("fails if one matchers is given and it fails", () => {
    const matcher = MockMatcher.fails();
    const anyOfMatcher = anyOf(matcher);

    assertThat(anyOfMatcher, matcherFails().given("actual"));
  });

  it("fails if all the matchers fail", () => {
    const matcher1 = MockMatcher.fails();
    const matcher2 = MockMatcher.fails();
    const matcher3 = MockMatcher.fails();
    const anyOfMatcher = anyOf(matcher1, matcher2, matcher3);

    assertThat(anyOfMatcher, matcherFails().given("actual"));

    assertThat(matcher1, matchCalled().with("actual").times(1));
    assertThat(matcher2, matchCalled().with("actual").times(1));
    assertThat(matcher3, matchCalled().with("actual").times(1));
  });

  it("describes expected with one matcher", () => {
    const matcher = MockMatcher.builder()
      .setExpected("something1")
      .build();
    const anyOfMatcher = anyOf(matcher);

    assertThat(anyOfMatcher, matcherDescribesExpectedAs("something1"));

    assertThat(matcher, describeExpectedCalled().times(1));
  });

  it("describes expected with multiple matchers", () => {
    const matcher1 = MockMatcher.builder()
      .setExpected("something1")
      .build();
    const matcher2 = MockMatcher.builder()
      .setExpected("something2")
      .build();
    const matcher3 = MockMatcher.builder()
      .setExpected("something3")
      .build();
    const anyOfMatcher = anyOf(matcher1, matcher2, matcher3);

    assertThat(anyOfMatcher, matcherDescribesExpectedAs("(something1 or something2 or something3)"));

    assertThat(matcher1, describeExpectedCalled().times(1));
    assertThat(matcher2, describeExpectedCalled().times(1));
    assertThat(matcher3, describeExpectedCalled().times(1));
  });

  it("describes actual by printing the value", () => {
    const matcher = MockMatcher.builder()
      .setActual("something")
      .build();
    const anyOfMatcher = anyOf(matcher);

    assertThat(anyOfMatcher, matcherDescribesActualAs("1").given(1));

    assertThat(matcher, describeActualNotCalled());
  });
});
