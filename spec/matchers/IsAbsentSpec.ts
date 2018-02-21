import { assertThat, equalTo, is, isAbsent } from "../../src";

describe("IsAbsent", () => {
  it("matches if actual is null", () => {
    const matcher = isAbsent<number>();

    assertThat(matcher.match(null), equalTo({ matches: true }));
  });

  it("matches if actual is undefined", () => {
    const matcher = isAbsent<number>();

    assertThat(matcher.match(undefined), equalTo({ matches: true }));
  });

  it("fails if the actual is not null or undefined", () => {
    const matcher = isAbsent<number>();

    assertThat(matcher.match(1), equalTo({ matches: false }));
  });

  it("describes the expected", () => {
    const matcher = isAbsent<number>();

    assertThat(matcher.describeExpected(), is("(null or undefined)"));
  });

  it("describes the actual by printing the value", () => {
    const matcher = isAbsent<number>();

    assertThat(matcher.describeActual(1), is("1"));
  });
});
