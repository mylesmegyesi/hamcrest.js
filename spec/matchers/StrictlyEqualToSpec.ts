import * as sinon from "sinon";

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
        .setExpected(expected.toString())
        .setActual(actual.toString())
        .build(),
      diff: {
        expected,
        actual,
      },
    });
  });

  it("prints using the given toString function", () => {
    const expected = { a: 1 };
    const actual = { a: 1 };
    const toString = sinon.stub();
    toString.onFirstCall().returns("firstCall");
    toString.onSecondCall().returns("secondCall");

    const matcher = strictlyEqualTo(expected, toString);

    const result = matcher.match(actual);
    assertThat(result, matcherDoesNotMatch());
    assertEqual(result, {
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("firstCall")
        .setActual("secondCall")
        .build(),
      diff: {
        expected,
        actual,
      },
    });
  });
});
