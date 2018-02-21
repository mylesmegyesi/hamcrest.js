import { anyOf, assertThat, equalTo, is } from "../../src";
import { MockMatcher } from "../MockMatcher";

describe("AnyOf", () => {
  it("matches if one matchers is given and it matches", () => {
    const matcher = MockMatcher.matches();

    const anyOfMatcher = anyOf(matcher);

    assertThat(anyOfMatcher.match("actual"), equalTo({ matches: true }));

    assertThat(matcher.matchCalledCount, is(1));
    assertThat(matcher.matchActual, is("actual"));
  });

  it("matches if any of the matchers match", () => {
    const matcher1 = MockMatcher.fails();
    const matcher2 = MockMatcher.matches();
    const matcher3 = MockMatcher.fails();

    const result = anyOf(matcher1, matcher2, matcher3).match("actual");

    assertThat(result, equalTo({ matches: true }));

    assertThat(matcher1.matchCalledCount, is(1));
    assertThat(matcher1.matchActual, is("actual"));
    assertThat(matcher2.matchCalledCount, is(1));
    assertThat(matcher2.matchActual, is("actual"));
    assertThat(matcher3.matchCalledCount, is(0));
  });

  it("fails if no matchers are given", () => {
    const anyOfMatcher = anyOf();

    assertThat(anyOfMatcher.match("actual"), equalTo({ matches: false }));
  });

  it("fails if one matchers is given and it fails", () => {
    const matcher = MockMatcher.fails();

    const anyOfMatcher = anyOf(matcher);

    assertThat(anyOfMatcher.match("actual"), equalTo({ matches: false }));
  });

  it("fails if all the matchers fail", () => {
    const matcher1 = MockMatcher.fails();
    const matcher2 = MockMatcher.fails();
    const matcher3 = MockMatcher.fails();

    const result = anyOf(matcher1, matcher2, matcher3).match("actual");

    assertThat(result, equalTo({ matches: false }));

    assertThat(matcher1.matchCalledCount, is(1));
    assertThat(matcher1.matchActual, is("actual"));
    assertThat(matcher2.matchCalledCount, is(1));
    assertThat(matcher2.matchActual, is("actual"));
    assertThat(matcher3.matchCalledCount, is(1));
    assertThat(matcher3.matchActual, is("actual"));
  });

  it("describes expected with one matcher", () => {
    const matcher = MockMatcher.builder()
      .setExpected("something1")
      .build();

    assertThat(anyOf(matcher).describeExpected(), is("something1"));

    assertThat(matcher.describeExpectedCalledCount, is(1));
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

    assertThat(anyOf(matcher1, matcher2, matcher3).describeExpected(), is("(something1 or something2 or something3)"));

    assertThat(matcher1.describeExpectedCalledCount, is(1));
    assertThat(matcher2.describeExpectedCalledCount, is(1));
    assertThat(matcher3.describeExpectedCalledCount, is(1));
  });

  it("describes actual by printing the value", () => {
    const matcher = MockMatcher.builder()
      .setActual("something")
      .build();

    assertThat(anyOf(matcher).describeActual(1), is("1"));

    assertThat(matcher.describeActualCalledCount, is(0));
  });
});
