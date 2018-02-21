import { assertThat, equalTo, is, looselyEqualTo } from "../../src";

describe("LooselyEqualTo", () => {
  it("matches if two objects are loosely equal", () => {
    const expected: string = "";

    const result = looselyEqualTo<string, number>(expected).match(0);

    assertThat(result, equalTo({
      matches: true,
      diff: {
        expected,
        actual: 0,
      },
    }));
  });

  it("fails if two objects are not loosely equal", () => {
    const result = looselyEqualTo(Number.NaN).match(Number.NaN);

    assertThat(result, equalTo({
      matches: false,
      diff: {
        expected: Number.NaN,
        actual: Number.NaN,
      },
    }));
  });

  it("describes the expected", () => {
    const matcher = looselyEqualTo<string, number>("0");

    assertThat(matcher.describeExpected(), is(`"0"`));
  });

  it("describes the actual", () => {
    const matcher = looselyEqualTo<string, number>("0");

    assertThat(matcher.describeActual(0), is("0"));
  });
});
