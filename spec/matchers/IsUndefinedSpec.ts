import { assertThat, equalTo, is, isUndefined } from "../../src";

describe("IsUndefined", () => {
  it("matches if the value is undefined", () => {
    const result = isUndefined<number>().match(undefined);

    assertThat(result, equalTo({
      matches: true,
      diff: {
        expected: undefined,
        actual: undefined,
      },
    }));
  });

  it("fails if the value is not undefined", () => {
    const result = isUndefined<number>().match(1);

    assertThat(result, equalTo({
      matches: false,
      diff: {
        expected: undefined,
        actual: 1,
      },
    }));
  });

  it("fails if the value is null", () => {
    const result = isUndefined<null>().match(null);

    assertThat(result, equalTo({
      matches: false,
      diff: {
        expected: undefined,
        actual: null,
      },
    }));
  });

  it("describes the expected", () => {
    const matcher = isUndefined<number>();

    assertThat(matcher.describeExpected(), is("undefined"));
  });

  it("describes the actual", () => {
    const matcher = isUndefined<number>();

    assertThat(matcher.describeActual(1), is("1"));
  });
});
