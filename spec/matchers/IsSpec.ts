import { assertThat, DescriptionBuilder, equalTo, is } from "../../src";

describe("Is", () => {
  it("matches if Object.is returns true", () => {
    const matcher = is(1);

    const result = matcher.match(1);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("1")
        .setActual("1")
        .build(),
    }));
  });

  it("fails if Object.is returns false", () => {
    const matcher = is(+0);

    const result = matcher.match(-0);

    assertThat(result, equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected("0")
        .setActual("-0")
        .build(),
      diff: {
        expected: 0,
        actual: -0,
      },
    }));
  });
});
