import { assertThat, DescriptionBuilder, looselyEqualTo, matcherDoesNotMatch, matcherMatches } from "../../src";
import { assertEqual } from "../BootstrapAssertions";

describe("LooselyEqualTo", () => {
  it("matches if two objects are loosely equal", () => {
    const value: string = "";

    const matcher = looselyEqualTo<string, number>(value);

    assertThat(matcher.match(0), matcherMatches());
  });

  it("fails if two objects are not loosely equal", () => {
    const matcher = looselyEqualTo(Number.NaN);

    const result = matcher.match(Number.NaN);

    assertThat(result, matcherDoesNotMatch());
    assertEqual(result, {
      matches: false,
      description: new DescriptionBuilder()
        .setExpected(Number.NaN.toString())
        .setActual(Number.NaN.toString())
        .build(),
      diff: {
        expected: Number.NaN,
        actual: Number.NaN,
      },
    });
  });
});
