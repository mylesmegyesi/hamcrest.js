import { assertThat, equalTo, is, isTrue } from "../../src";

describe("IsTrue", () => {
  it("matches when the actual is true", () => {
    const result = isTrue().match(true);

    assertThat(result, equalTo({
      matches: true,
      diff: {
        expected: true,
        actual: true,
      },
    }));
  });

  it("fails when the actual is false", () => {
    const result = isTrue().match(false);

    assertThat(result, equalTo({
      matches: false,
      diff: {
        expected: true,
        actual: false,
      },
    }));
  });

  it("describes the expected", () => {
    const matcher = isTrue();

    assertThat(matcher.describeExpected(), is("true"));
  });

  it("describes the actual", () => {
    const matcher = isTrue();

    assertThat(matcher.describeActual(true), is("true"));
    assertThat(matcher.describeActual(false), is("false"));
  });
});
