import * as sinon from "sinon";

import { assertThat, DescriptionBuilder, looselyEqualTo, matcherDoesNotMatch, matcherMatches } from "../../src";
import { assertEqual } from "../BootstrapAssertions";

describe("LooselyEqualTo", () => {
  it("matches if two objects are loosely equal", () => {
    const value: any = "";

    const matcher = looselyEqualTo(value);

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

  it("prints using the given toString function", () => {
    const expected = Number.NaN;
    const actual = Number.NaN;
    const toString = sinon.stub();
    toString.onFirstCall().returns("firstCall");
    toString.onSecondCall().returns("secondCall");

    const matcher = looselyEqualTo(expected, toString);

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
