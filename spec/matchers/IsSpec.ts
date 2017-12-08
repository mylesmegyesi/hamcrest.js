import { assertThat, is, matcherDoesNotMatch, matcherMatches } from "../../src";

describe("Is", () => {
  it("matches if Object.is returns true", () => {
    const matcher = is(1);

    assertThat(matcher.match(1), matcherMatches());
  });

  it("fails if Object.is returns false", () => {
    const matcher = is(+0);

    assertThat(matcher.match(-0), matcherDoesNotMatch());
  });
});
