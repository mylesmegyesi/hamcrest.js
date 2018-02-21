import { allOf, assertThat } from "../../src";
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

describe("AllOf", () => {
  it("matches if all the matchers match", () => {
    const matcher1 = MockMatcher.matches<string>();
    const matcher2 = MockMatcher.matches<string>();
    const matcher3 = MockMatcher.matches<string>();

    const allOfMatcher = allOf(matcher1, matcher2, matcher3);

    assertThat(allOfMatcher, matcherMatches().given("actual"));

    assertThat(matcher1, matchCalled({ actual: "actual" }));
    assertThat(matcher2, matchCalled({ actual: "actual" }));
    assertThat(matcher3, matchCalled({ actual: "actual" }));
  });

  it("fails if one of the matchers fails", () => {
    const matcher1 = MockMatcher.matches<string>();
    const matcher2 = MockMatcher.fails<string>();
    const matcher3 = MockMatcher.matches<string>();

    const allOfMatcher = allOf(matcher1, matcher2, matcher3);

    assertThat(allOfMatcher, matcherFails().given("actual"));

    assertThat(matcher1, matchCalled({ actual: "actual" }));
    assertThat(matcher2, matchCalled({ actual: "actual" }));
    assertThat(matcher3, matchNotCalled());
  });

  it("describes expected with one matcher", () => {
    const matcher = MockMatcher.builder()
      .setExpected("something1")
      .build();

    assertThat(allOf(matcher), matcherDescribesExpectedAs("something1"));

    assertThat(matcher, describeExpectedCalled(1));
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

    assertThat(allOf(matcher1, matcher2, matcher3), matcherDescribesExpectedAs("(something1 and something2 and something3)"));

    assertThat(matcher1, describeExpectedCalled(1));
    assertThat(matcher2, describeExpectedCalled(1));
    assertThat(matcher3, describeExpectedCalled(1));
  });

  it("describes actual by printing the value", () => {
    const matcher = MockMatcher.builder<string, string>()
      .setActual("something")
      .setData("matcher data")
      .build();

    assertThat(allOf(matcher), matcherDescribesActualAs("1").given(1));

    assertThat(matcher, describeActualNotCalled());
  });
});
