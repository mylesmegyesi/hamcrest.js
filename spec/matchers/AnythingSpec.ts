import { anything, assertThat, equalTo } from "../../src";

describe("Anything", () => {
  it("always matches", () => {
    const matcher = anything();

    const matchResult = matcher.match(1);

    assertThat(matchResult, equalTo({ matches: true }));
  });
});
