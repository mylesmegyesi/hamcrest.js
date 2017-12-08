import { assertThat, DescriptionBuilder, matcherDoesNotMatch, matcherMatches, strictlyEqualTo } from "../../src";
import { assertEqual } from "../BootstrapAssertions";

describe("StrictlyEqualTo", () => {
  it("matches if two objects the same instance", () => {
    const value = { a: 1 };

    const matcher = strictlyEqualTo(value);

    assertThat(matcher.match(value), matcherMatches());
  });

  it("fails if two objects are not strictly equal", () => {
    const expected = { a: 1 };
    const actual = { a: 1 };

    const matcher = strictlyEqualTo(expected);

    const result = matcher.match(actual);
    assertThat(result, matcherDoesNotMatch());
    assertEqual(result, {
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("{ a: 1 }")
        .setActual("{ a: 1 }")
        .build(),
      diff: {
        expected,
        actual,
      },
    });
  });
});
