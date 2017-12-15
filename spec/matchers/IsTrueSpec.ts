import { assertThat, DescriptionBuilder, equalTo, isTrue } from "../../src";

describe("IsTrue", () => {
  it("matches when the actual is true", () => {
    const matcher = isTrue();

    const result = matcher.match(true);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("true")
        .setActual("true")
        .build(),
    }));
  });

  it("fails when the actual is false", () => {
    const matcher = isTrue();

    const result = matcher.match(false);

    assertThat(result, equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected("true")
        .setActual("false")
        .build(),
      diff: {
        expected: true,
        actual: false,
      },
    }));
  });
});
