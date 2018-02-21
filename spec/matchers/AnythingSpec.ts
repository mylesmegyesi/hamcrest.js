import { anything, assertThat, equalTo, is } from "../../src";

describe("Anything", () => {
  it("always matches", () => {
    const matcher = anything();

    const matchResult = matcher.match(1);

    assertThat(matchResult, equalTo({ matches: true }));
  });

  it("describes expected", () => {
    const matcher = anything();

    assertThat(matcher.describeExpected(), is("anything"));
  });

  it("describes actual by printing the value", () => {
    const matcher = anything();

    assertThat(matcher.describeActual(1), is("1"));
  });
});
