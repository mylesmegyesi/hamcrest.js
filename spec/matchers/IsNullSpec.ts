import { assertThat, DescriptionBuilder, equalTo, isNull, Matcher } from "../../src";

describe("IsNull", () => {
  it("matches if the value is null", () => {
    const matcher: Matcher<number | null> = isNull<number>();

    assertThat(matcher.match(null), equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("null")
        .setActual("null")
        .build(),
    }));
  });

  it("fails if the value is not null", () => {
    const matcher: Matcher<number | null> = isNull<number>();

    assertThat(matcher.match(1), equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected("null")
        .setActual("1")
        .build(),
      diff: {
        expected: null,
        actual: 1,
      },
    }));
  });

  it("fails if the value is undefined", () => {
    const matcher: Matcher<undefined | null> = isNull<undefined>();

    assertThat(matcher.match(undefined), equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected("null")
        .setActual("undefined")
        .build(),
      diff: {
        expected: null,
        actual: undefined,
      },
    }));
  });
});
