import { assertThat, equalTo, is, isFalse, isTrue, matchesObject } from "../../src";

describe("EqualTo", () => {
  it("matches if two objects have the same value", () => {
    const actual = { a: 1 };
    const expected = { a: 1 };

    const matcher = equalTo(expected);

    assertThat(matcher.match(actual), matchesObject({
      matches: isTrue(),
      diff: matchesObject({
        expected: is(expected),
        actual: is(actual),
      }),
    }));
  });

  it("fails if two objects do not have the same value", () => {
    const actual = { a: 1 };
    const expected = { a: 2 };

    assertThat(
      equalTo(expected).match(actual),
      matchesObject({
        matches: isFalse(),
        diff: matchesObject({
          expected: is(expected),
          actual: is(actual),
        }),
      }));
  });

  it("describes the expected by printing the value", () => {
    const matcher = equalTo({ a: 2 });

    assertThat(matcher.describeExpected(), is("{ a: 2 }"));
  });

  it("describes the actual by printing the value", () => {
    const matcher = equalTo({ a: 2 });

    assertThat(matcher.describeActual({ a: 1 }), is("{ a: 1 }"));
  });
});
