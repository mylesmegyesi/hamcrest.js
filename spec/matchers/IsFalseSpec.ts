import { assertThat, equalTo, is, isFalse } from "../../src";

describe("IsFalse", () => {
  it("matches when the actual is false", () => {
    const result = isFalse().match(false);

    assertThat(result, equalTo({
      matches: true,
      diff: {
        expected: false,
        actual: false,
      },
    }));
  });

  it("fails when the actual is false", () => {
    const result = isFalse().match(true);

    assertThat(result, equalTo({
      matches: false,
      diff: {
        expected: false,
        actual: true,
      },
    }));
  });

  it("describes expected", () => {
    const matcher = isFalse();

    assertThat(matcher.describeExpected(), is("false"));
  });

  it("describes the actual by printing the value", () => {
    const matcher = isFalse();

    assertThat(matcher.describeActual(false), is("false"));
    assertThat(matcher.describeActual(true), is("true"));
  });
});
