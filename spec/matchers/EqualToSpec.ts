import * as sinon from "sinon";

import { assertThat, DescriptionBuilder, equalTo, isTrue, matcherDoesNotMatch, matcherMatches } from "../../src";
import { assertEqual } from "../BootstrapAssertions";

describe("EqualTo", () => {
  it("matches if the given equality tester returns true", () => {
    const expected: string = "something";
    const actual = "something else";
    const test = sinon.stub().returns(true);
    const matcher = equalTo(expected, test);

    const result = matcher.match(actual);
    assertThat(result, matcherMatches());

    assertThat(test.calledOnce, isTrue());
    assertThat(test.calledWithExactly(expected, actual), isTrue());
  });

  it("fails if the given equality tester returns false", () => {
    const expected = "something";
    const test = sinon.stub().returns(false);
    const matcher = equalTo(expected, test);

    const result = matcher.match(expected);
    assertThat(result, matcherDoesNotMatch());
    assertEqual(result, {
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("something")
        .setActual("something")
        .build(),
      diff: {
        expected,
        actual: expected,
      },
    });
  });

  it("prints using the given toString function", () => {
    const expected: string = "something";
    const actual = "something else";
    const test = sinon.stub().returns(false);
    const toString = sinon.stub();
    toString.onFirstCall().returns("firstCall");
    toString.onSecondCall().returns("secondCall");
    const matcher = equalTo(expected, test, toString);

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
