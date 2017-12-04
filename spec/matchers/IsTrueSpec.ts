import { assertThat, isTrue, matcherDoesNotMatch, matcherMatches } from "../../src";

describe("isTrue", () => {
  it("matches when the actual is true", () => {
    const matcher = isTrue();

    const result = matcher.match(true);

    assertThat(result, matcherMatches());
  });

  it("fails when the actual is false", () => {
    const matcher = isTrue();

    const result = matcher.match(false);

    assertThat(result, matcherDoesNotMatch());
  });
});
