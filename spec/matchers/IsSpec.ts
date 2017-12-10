import { assertThat, DescriptionBuilder, equalTo, is } from "../../src";

describe("Is", () => {
  it("matches if Object.is returns true", () => {
    const matcher = is(1);

    const result = matcher.match(1);

    assertThat(result, equalTo({ matches: true }));
  });

  it("fails if Object.is returns false", () => {
    const matcher = is(+0);

    const result = matcher.match(-0);

    assertThat(result, equalTo({
      matches: false as false,
      description: new DescriptionBuilder()
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
