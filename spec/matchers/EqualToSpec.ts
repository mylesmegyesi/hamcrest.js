import { assertThat, equalTo, hasProperties, isFalse, isTrue, strictlyEqualTo } from "../../src";

describe("EqualTo", () => {
  it("matches if two objects have the same value", () => {
    const actual = { a: 1 };
    const expected = { a: 1 };

    const matcher = equalTo(actual);

    assertThat(matcher.match(expected), hasProperties({
      matches: isTrue(),
    }));
  });

  it("fails if two objects do not have the same value", () => {
    const actual = { a: 1 };
    const expected = { a: 2 };

    const result = equalTo(expected).match(actual);

    assertThat(result, hasProperties({
      matches: isFalse(),
      description: hasProperties({
        expected: strictlyEqualTo("{ a: 2 }"),
        actual: strictlyEqualTo("{ a: 1 }"),
      }),
      diff: hasProperties({
        expected: strictlyEqualTo(expected),
        actual: strictlyEqualTo(actual),
      }),
    }));
  });
});
