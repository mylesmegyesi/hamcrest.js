import {
  assertThat,
  DescriptionBuilder,
  equalTo,
  matcherDoesNotMatch,
  matcherMatches,
  strictlyEqualTo,
} from "../../src";
import { assertEqual } from "../BootstrapAssertions";

describe("EqualTo", () => {
  it("matches if two objects have the same value", () => {
    const actual = { a: 1 };
    const expected = { a: 1 };

    const matcher = equalTo(actual);

    assertThat(matcher.match(expected), matcherMatches());
  });

  it("fails if two objects do not have the same value", () => {
    const actual = { a: 1 };
    const expected = { a: 2 };

    const matcher = strictlyEqualTo(expected);
    const result = matcher.match(actual);

    assertThat(result, matcherDoesNotMatch());
    assertEqual(result, {
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("{ a: 2 }")
        .setActual("{ a: 1 }")
        .build(),
      diff: {
        expected: { a: 2 },
        actual: { a: 1 },
      },
    });
  });
});
