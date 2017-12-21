import { assertThat, DescriptionBuilder, equalTo, isAbsent, Matcher } from "../../src";

describe("IsAbsent", () => {
  it("matches if actual is null", () => {
    const matcher: Matcher<number | null | undefined> = isAbsent<number>();

    assertThat(matcher.match(null), equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("(null or undefined)")
        .setActual("null")
        .build(),
    }));
  });

  it("matches if actual is undefined", () => {
    const matcher: Matcher<number | null | undefined> = isAbsent<number>();

    assertThat(matcher.match(undefined), equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("(null or undefined)")
        .setActual("undefined")
        .build(),
    }));
  });

  it("fails if the actual is not null or undefined", () => {
    const matcher: Matcher<number | null | undefined> = isAbsent<number>();

    assertThat(matcher.match(1), equalTo({
      matches: false,
      description: DescriptionBuilder()
        .setExpected("(null or undefined)")
        .setActual("1")
        .build(),
    }));
  });
});
