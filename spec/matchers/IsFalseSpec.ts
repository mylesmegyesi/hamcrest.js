import { assertThat, DescriptionBuilder, equalTo, isFalse } from "../../src";

describe("IsFalse", () => {
  it("matches when the actual is false", () => {
    const matcher = isFalse();

    const result = matcher.match(false);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("false")
        .setActual("false")
        .build(),
    }));
  });

  it("fails when the actual is false", () => {
    const matcher = isFalse();

    const result = matcher.match(true);

    assertThat(result, equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected("false")
        .setActual("true")
        .build(),
      diff: {
        expected: false,
        actual: true,
      },
    }));
  });
});
