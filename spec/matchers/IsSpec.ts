import { assertThat, equalTo, is } from "../../src";

describe("Is", () => {
  it("matches if Object.is returns true", () => {
    const matcher = is(1);

    const result = matcher.match(1);

    assertThat(result, equalTo({
      matches: true,
      diff: {
        expected: 1,
        actual: 1,
      },
    }));
  });

  it("fails if Object.is returns false", () => {
    const matcher = is(+0);

    const result = matcher.match(-0);

    assertThat(result, equalTo({
      matches: false,
      diff: {
        expected: +0,
        actual: -0,
      },
    }));
  });

  it("describes the expected", () => {
    const matcher = is(+0);

    assertThat(matcher.describeExpected(), is("0"));
  });

  it("describes the actual", () => {
    const matcher = is(+0);

    assertThat(matcher.describeActual(-0), is("-0"));
  });
});
