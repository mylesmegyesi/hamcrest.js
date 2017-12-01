import { any, assertThat, matcherMatches } from "../../src";

describe("Any", () => {
  it("always matches", () => {
    const matcher = any();

    const matchResult = matcher.match(1);

    assertThat(matchResult, matcherMatches());
  });
});
