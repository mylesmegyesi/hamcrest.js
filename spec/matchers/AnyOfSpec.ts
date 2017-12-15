import { anyOf, assertThat, DescriptionBuilder, equalTo, is, strictlyEqualTo } from "../../src";
import { mockMatcher } from "../MockMatcher";

describe("AnyOf", () => {
  it("matches if any of the matchers match", () => {
    const matcher1 = mockMatcher({
      matches: false,
      description: DescriptionBuilder()
        .setExpected("something1")
        .setActual("something else")
        .build(),
    });
    const matcher2 = mockMatcher({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("something2")
        .setActual("something else")
        .build(),
    });
    const matcher3 = mockMatcher({
      matches: false,
      description: DescriptionBuilder()
        .setExpected("something3")
        .setActual("something else")
        .build(),
    });

    const result = anyOf(matcher1, matcher2, matcher3).match("actual");

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("(something1 or something2 or something3)")
        .setActual(`"actual"`)
        .build(),
    }));
    assertThat(matcher1.matchCalledCount, is(1));
    assertThat(matcher1.actual, is("actual"));
    assertThat(matcher2.matchCalledCount, is(1));
    assertThat(matcher2.actual, is("actual"));
    assertThat(matcher3.matchCalledCount, is(1));
    assertThat(matcher3.actual, is("actual"));
  });

  it("fails if no matchers are given", () => {
    const anyOfMatcher = anyOf();

    assertThat(anyOfMatcher.match("actual"), equalTo({
      matches: false,
      description: DescriptionBuilder()
        .setExpected("()")
        .setActual(`"actual"`)
        .build(),
    }));
  });

  it("fails if all the matchers fail", () => {
    const matcher1 = mockMatcher({
      matches: false,
      description: DescriptionBuilder()
        .setExpected("matcher 1 to match")
        .setActual("actual")
        .build(),
    });
    const matcher2 = mockMatcher({
      matches: false,
      description: DescriptionBuilder()
        .setExpected("matcher 2 to match")
        .setActual("actual")
        .build(),
    });
    const matcher3 = mockMatcher({
      matches: false,
      description: DescriptionBuilder()
        .setExpected("matcher 3 to match")
        .setActual("actual")
        .build(),
    });

    const result = anyOf(matcher1, matcher2, matcher3).match("actual");

    assertThat(result, equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected("(matcher 1 to match or matcher 2 to match or matcher 3 to match)")
        .setActual(`"actual"`)
        .build(),
    }));
    assertThat(matcher1.matchCalledCount, is(1));
    assertThat(matcher1.actual, is("actual"));
    assertThat(matcher2.matchCalledCount, is(1));
    assertThat(matcher2.actual, is("actual"));
    assertThat(matcher3.matchCalledCount, is(1));
    assertThat(matcher3.actual, is("actual"));
  });

  it("returns the first matcher's failure result if there is only one matcher given", () => {
    const matcher = mockMatcher({
      matches: false,
      description: DescriptionBuilder()
        .setExpected("matcher 1 to match")
        .setActual("1")
        .build(),
    });

    const result = anyOf(matcher).match("actual");

    assertThat(result, strictlyEqualTo(matcher.result));
  });
});
