import { assertThat, DescriptionBuilder, equalTo, isUndefined, Matcher } from "../../src";

describe("IsUndefined", () => {
  it("matches if the value is undefined", () => {
    const matcher: Matcher<number | undefined> = isUndefined<number>();

    assertThat(matcher.match(undefined), equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("undefined")
        .setActual("undefined")
        .build(),
    }));
  });

  it("fails if the value is not undefined", () => {
    const matcher: Matcher<number | undefined> = isUndefined<number>();

    assertThat(matcher.match(1), equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected("undefined")
        .setActual("1")
        .build(),
      diff: {
        expected: undefined,
        actual: 1,
      },
    }));
  });

  it("fails if the value is null", () => {
    const matcher: Matcher<null | undefined> = isUndefined<null>();

    assertThat(matcher.match(null), equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected("undefined")
        .setActual("null")
        .build(),
      diff: {
        expected: undefined,
        actual: null,
      },
    }));
  });
});
