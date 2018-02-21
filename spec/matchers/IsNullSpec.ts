import { assertThat, equalTo, is, isNull } from "../../src";

describe("IsNull", () => {
  it("matches if the value is null", () => {
    const result = isNull<number>().match(null);

    assertThat(result, equalTo({
      matches: true,
      diff: {
        expected: null,
        actual: null,
      },
    }));
  });

  it("fails if the value is not null", () => {
    const result = isNull<number>().match(1);

    assertThat(result, equalTo({
      matches: false,
      diff: {
        expected: null,
        actual: 1,
      },
    }));
  });

  it("fails if the value is undefined", () => {
    const result = isNull<undefined>().match(undefined);

    assertThat(result, equalTo({
      matches: false as false,
      diff: {
        expected: null,
        actual: undefined,
      },
    }));
  });

  it("describes the expected", () => {
    const matcher = isNull<undefined>();

    assertThat(matcher.describeExpected(), is("null"));
  });

  it("describes the actual", () => {
    const matcher = isNull<number>();

    assertThat(matcher.describeActual(1), is("1"));
  });
});
