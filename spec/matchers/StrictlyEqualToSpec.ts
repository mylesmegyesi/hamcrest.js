import { assertThat, equalTo, is, strictlyEqualTo } from "../../src";

describe("StrictlyEqualTo", () => {
  it("matches if two objects the same instance", () => {
    const value = { a: 1 };

    const result = strictlyEqualTo(value).match(value);

    assertThat(result, equalTo({
      matches: true,
      diff: {
        expected: value,
        actual: value,
      },
    }));
  });

  it("fails if two objects are not strictly equal", () => {
    const expected = { a: 1 };
    const actual = { a: 1 };

    const result = strictlyEqualTo(expected).match(actual);

    assertThat(result, equalTo({
      matches: false,
      diff: {
        expected,
        actual,
      },
    }));
  });

  it("describes expected", () => {
    const matcher = strictlyEqualTo({ a: 1 });

    assertThat(matcher.describeExpected(), is("{ a: 1 }"));
  });

  it("describes actual", () => {
    const value = { a: 1 };
    const matcher = strictlyEqualTo(value);

    assertThat(matcher.describeActual(value), is("{ a: 1 }"));
  });
});
