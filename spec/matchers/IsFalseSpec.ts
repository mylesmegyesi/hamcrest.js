import { assertThat, isFalse, matcherDoesNotMatch, matcherMatches } from "../../src";

describe("isTrue", () => {
  it("matches when the actual is false", () => {
    const matcher = isFalse();

    const result = matcher.match(false);

    assertThat(result, matcherMatches());
  });

  it("fails when the actual is false", () => {
    const matcher = isFalse();

    const result = matcher.match(true);

    assertThat(result, matcherDoesNotMatch());
  });
});
