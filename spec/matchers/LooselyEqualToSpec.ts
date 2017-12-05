import * as sinon from "sinon";

import {
  assertThat,
  DescriptionBuilder,
  isTrue,
  looselyEqualTo,
  matcherDoesNotMatch,
  matcherMatches,
} from "../../src";
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

  it("prints using the given toString functions", () => {
    const expected = Number.NaN;
    const actual = Number.NaN;
    const expectedToString = sinon.stub().returns("expected value");
    const actualToString = sinon.stub().returns("actual value");

    const matcher = looselyEqualTo(expected, expectedToString, actualToString);

    const result = matcher.match(actual);
    assertThat(result, matcherDoesNotMatch());
    assertEqual(result, {
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("expected value")
        .setActual("actual value")
        .build(),
      diff: {
        expected,
        actual,
      },
    });

    assertThat(expectedToString.calledOnce, isTrue());
    assertThat(expectedToString.calledWithExactly(expected), isTrue());
    assertThat(actualToString.calledOnce, isTrue());
    assertThat(actualToString.calledWithExactly(actual), isTrue());
  });
});
