import { assertThat, DescriptionBuilder, equalTo, isPresent, Matcher } from "../../src";

describe("IsPresent", () => {
  it("matches if the value is not null or undefined", () => {
    const matcher: Matcher<number | null | undefined> = isPresent<number>();

    assertThat(matcher.match(1), equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("not (null or undefined)")
        .setActual("1")
        .build(),
    }));
  });

  it("fails if the value is null", () => {
    const matcher: Matcher<number | null | undefined> = isPresent<number>();

    assertThat(matcher.match(null), equalTo({
      matches: false,
      description: DescriptionBuilder()
        .setExpected("not (null or undefined)")
        .setActual("null")
        .build(),
    }));
  });

  it("fails if the value is undefined", () => {
    const matcher: Matcher<number | null | undefined> = isPresent<number>();

    assertThat(matcher.match(undefined), equalTo({
      matches: false,
      description: DescriptionBuilder()
        .setExpected("not (null or undefined)")
        .setActual("undefined")
        .build(),
    }));
  });

  it("matches if the value is not null or undefined and the inner matcher matches", () => {
    const matcher: Matcher<number | null | undefined> = isPresent<number>(equalTo(1));

    assertThat(matcher.match(1), equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("1")
        .setActual("1")
        .build(),
    }));
  });

  it("fails if the value is not null or undefined and the inner matcher fails", () => {
    const matcher: Matcher<number | null | undefined> = isPresent<number>(equalTo(2));

    assertThat(matcher.match(1), equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected("2")
        .setActual("1")
        .build(),
      diff: {
        expected: 2,
        actual: 1,
      },
    }));
  });
});
