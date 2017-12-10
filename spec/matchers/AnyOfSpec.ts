import { anyOf, assertThat, DescriptionBuilder, equalTo, FailedMatchResult, is, strictlyEqualTo } from "../../src";
import { mockMatcherThatFails, mockMatcherThatMatches } from "../MockMatcher";

describe("AnyOf", () => {
  it("matches if any of the matchers match", () => {
    const failureResult: FailedMatchResult = {
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("1")
        .setActual("2")
        .build(),
    };
    const matcher1 = mockMatcherThatFails(failureResult);
    const matcher2 = mockMatcherThatMatches();
    const matcher3 = mockMatcherThatFails(failureResult);

    const result = anyOf(matcher1, matcher2, matcher3).match("actual");

    assertThat(result, equalTo({ matches: true }));
    assertThat(matcher1.matchCalledCount, is(1));
    assertThat(matcher1.actual, is("actual"));
    assertThat(matcher2.matchCalledCount, is(1));
    assertThat(matcher2.actual, is("actual"));
    assertThat(matcher3.matchCalledCount, is(0));
  });

  it("matches if no matchers are given", () => {
    const anyOfMatcher = anyOf();

    assertThat(anyOfMatcher.match("actual"), equalTo({ matches: true }));
  });

  it("fails if all the matchers fail", () => {
    const matcher1 = mockMatcherThatFails({
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("matcher 1 to match")
        .setActual("actual")
        .build(),
    });
    const matcher2 = mockMatcherThatFails({
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("matcher 2 to match")
        .setActual("actual")
        .build(),
    });
    const matcher3 = mockMatcherThatFails({
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("matcher 3 to match")
        .setActual("actual")
        .build(),
    });

    const result = anyOf(matcher1, matcher2, matcher3).match("actual");

    assertThat(result, equalTo({
      matches: false as false,
      description: new DescriptionBuilder()
        .setExpected("matcher 1 to match or matcher 2 to match or matcher 3 to match")
        .setActual("actual")
        .build(),
    }));
    assertThat(matcher1.matchCalledCount, is(1));
    assertThat(matcher1.actual, is("actual"));
    assertThat(matcher2.matchCalledCount, is(1));
    assertThat(matcher2.actual, is("actual"));
    assertThat(matcher3.matchCalledCount, is(1));
    assertThat(matcher3.actual, is("actual"));
  });

  it("uses the actual from the first failed matcher", () => {
    const matcher1 = mockMatcherThatFails({
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("matcher 1 to match")
        .setActual("1")
        .build(),
    });
    const matcher2 = mockMatcherThatFails({
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("matcher 2 to match")
        .setActual("2")
        .build(),
    });

    const result = anyOf(matcher1, matcher2).match("actual");

    assertThat(result, equalTo({
      matches: false as false,
      description: new DescriptionBuilder()
        .setExpected("matcher 1 to match or matcher 2 to match")
        .setActual("1")
        .build(),
    }));
  });

  it("returns the first matcher's failure result if there is only one matcher given", () => {
    const expectedFailureResult: FailedMatchResult = {
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("matcher 1 to match")
        .setActual("1")
        .build(),
    };
    const matcher = mockMatcherThatFails(expectedFailureResult);

    const result = anyOf(matcher).match("actual");

    assertThat(result, strictlyEqualTo(expectedFailureResult));
  });
});
