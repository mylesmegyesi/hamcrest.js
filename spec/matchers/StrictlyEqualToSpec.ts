import { assertThat, DescriptionBuilder, equalTo, strictlyEqualTo } from "../../src";

describe("StrictlyEqualTo", () => {
  it("matches if two objects the same instance", () => {
    const value = { a: 1 };

    const result = strictlyEqualTo(value).match(value);

    assertThat(result, equalTo({ matches: true }));
  });

  it("fails if two objects are not strictly equal", () => {
    const expected = { a: 1 };
    const actual = { a: 1 };

    const result = strictlyEqualTo(expected).match(actual);

    assertThat(result, equalTo({
      matches: false as false,
      description: new DescriptionBuilder()
        .setExpected("{ a: 1 }")
        .setActual("{ a: 1 }")
        .build(),
      diff: {
        expected,
        actual,
      },
    }));
  });
});
