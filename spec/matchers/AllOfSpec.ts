import { allOf, assertThat, DescriptionBuilder, equalTo, is, strictlyEqualTo } from "../../src";
import { mockMatcher } from "../MockMatcher";

describe("AllOf", () => {
  it("matches if all the matchers match", () => {
    const matcher1 = mockMatcher({
      matches: true,
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
      matches: true,
      description: DescriptionBuilder()
        .setExpected("something3")
        .setActual("something else")
        .build(),
    });

    const allOfMatcher = allOf(matcher1, matcher2, matcher3);

    assertThat(allOfMatcher.match("actual"), equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("(something1 and something2 and something3)")
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

  it("fails if one of the matchers fails", () => {
    const matcher1 = mockMatcher({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("something1")
        .setActual("something else")
        .build(),
    });
    const matcher2 = mockMatcher({
      matches: false,
      description: DescriptionBuilder()
        .setExpected("something2")
        .setActual("something else")
        .build(),
    });
    const matcher3 = mockMatcher({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("something3")
        .setActual("something else")
        .build(),
    });

    const allOfMatcher = allOf(matcher1, matcher2, matcher3);

    assertThat(allOfMatcher.match("actual"), strictlyEqualTo(matcher2.result));

    assertThat(matcher1.matchCalledCount, is(1));
    assertThat(matcher2.matchCalledCount, is(1));
    assertThat(matcher3.matchCalledCount, is(0));
  });
});
