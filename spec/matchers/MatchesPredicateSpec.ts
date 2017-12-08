import * as sinon from "sinon";

import { assertThat, DescriptionBuilder, isTrue, matcherDoesNotMatch, matcherMatches, matches } from "../../src";
import { assertEqual } from "../BootstrapAssertions";

describe("MatchesPredicate", () => {
  it("matches if the given predicate returns true", () => {
    const expected = "something";
    const actual = "something else";
    const test = sinon.stub().returns(true);
    const matcher = matches<string, string>(expected, test);

    const result = matcher.match(actual);
    assertThat(result, matcherMatches());

    assertThat(test.calledOnce, isTrue());
    assertThat(test.calledWithExactly(expected, actual), isTrue());
  });

  it("fails if the given equality tester returns false", () => {
    const expected = "something";
    const test = sinon.stub().returns(false);
    const matcher = matches<string, string>(expected, test);

    const result = matcher.match(expected);
    assertThat(result, matcherDoesNotMatch());
    assertEqual(result, {
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("\"something\"")
        .setActual("\"something\"")
        .build(),
      diff: {
        expected,
        actual: expected,
      },
    });
  });
});