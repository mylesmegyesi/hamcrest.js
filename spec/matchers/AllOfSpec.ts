import { allOf, assertThat, equalTo, is } from "../../src";
import { MockMatcher } from "../MockMatcher";

describe("AllOf", () => {
  it("matches if all the matchers match", () => {
    const matcher1 = MockMatcher.matches();
    const matcher2 = MockMatcher.matches();
    const matcher3 = MockMatcher.matches();

    const allOfMatcher = allOf(matcher1, matcher2, matcher3);

    assertThat(allOfMatcher.match("actual"), equalTo({
      matches: true,
    }));

    assertThat(matcher1.matchCalledCount, is(1));
    assertThat(matcher1.matchActual, is("actual"));
    assertThat(matcher2.matchCalledCount, is(1));
    assertThat(matcher2.matchActual, is("actual"));
    assertThat(matcher3.matchCalledCount, is(1));
    assertThat(matcher3.matchActual, is("actual"));
  });

  it("fails if one of the matchers fails", () => {
    const matcher1 = MockMatcher.matches();
    const matcher2 = MockMatcher.fails();
    const matcher3 = MockMatcher.matches();

    const allOfMatcher = allOf(matcher1, matcher2, matcher3);

    assertThat(allOfMatcher.match("actual"), equalTo({
      matches: false,
    }));

    assertThat(matcher1.matchCalledCount, is(1));
    assertThat(matcher2.matchCalledCount, is(1));
    assertThat(matcher3.matchCalledCount, is(0));
  });

  it("describes expected with one matcher", () => {
    const matcher = MockMatcher.builder()
      .setExpected("something1")
      .build();

    assertThat(allOf(matcher).describeExpected(), is("something1"));

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

    assertThat(allOf(matcher1, matcher2, matcher3).describeExpected(), is("(something1 and something2 and something3)"));

    assertThat(matcher1.describeExpectedCalledCount, is(1));
    assertThat(matcher2.describeExpectedCalledCount, is(1));
    assertThat(matcher3.describeExpectedCalledCount, is(1));
  });

  it("describes actual by printing the value", () => {
    const matcher = MockMatcher.builder()
      .setActual("something")
      .build();

    assertThat(allOf(matcher).describeActual(1), is("1"));

    assertThat(matcher.describeActualCalledCount, is(0));
  });
});
