import { assertThat, equalTo, hasProperties, is, isFalse, isTrue, matchesObject } from "../../src";

describe("EqualTo", () => {
  it("matches if two objects have the same value", () => {
    const actual = { a: 1 };
    const expected = { a: 1 };

    const matcher = equalTo(actual);

    assertThat(matcher.match(expected), matchesObject({
      matches: isTrue(),
      description: hasProperties({
        expected: is("{ a: 1 }"),
        actual: is("{ a: 1 }"),
      }),
    }));
  });

  it("fails if two objects do not have the same value", () => {
    const actual = { a: 1 };
    const expected = { a: 2 };

    const result = equalTo(expected).match(actual);

    assertThat(result, hasProperties({
      matches: isFalse(),
      description: hasProperties({
        expected: is("{ a: 2 }"),
        actual: is("{ a: 1 }"),
      }),
      diff: hasProperties({
        expected: is(expected),
        actual: is(actual),
      }),
    }));
  });
});
