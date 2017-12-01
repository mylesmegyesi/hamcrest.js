import { anything, assertThat, matcherMatches } from "../../src";

describe("Anything", () => {
  it("always matches", () => {
    const matcher = anything();

    const matchResult = matcher.match(1);

    assertThat(matchResult, matcherMatches());
  });
});
