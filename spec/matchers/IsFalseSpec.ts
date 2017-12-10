import { assertThat, DescriptionBuilder, equalTo, isFalse } from "../../src";

describe("isTrue", () => {
  it("matches when the actual is false", () => {
    const matcher = isFalse();

    const result = matcher.match(false);

    assertThat(result, equalTo({ matches: true }));
  });

  it("fails when the actual is false", () => {
    const matcher = isFalse();

    const result = matcher.match(true);

    assertThat(result, equalTo({
      matches: false as false,
      description: new DescriptionBuilder()
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
