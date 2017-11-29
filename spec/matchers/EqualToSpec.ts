import * as sinon from "sinon";

import { assertThat, Description, equalTo, matcherDoesNotMatch, matcherMatches } from "../../src";
import { assertEqual, assertTrue } from "../BootstrapAssertions";

describe("EqualTo", () => {
  function buildExpectedEqualToDescription(actual: string, expected: string): Description {
    return {
      expectedLabel: "Expected",
      expected,
      actualLabel: "got",
      actual,
    };
  }

  it("matches if two objects are deeply equal", () => {
    const expected = {
      a: 1,
      b: {
        c: 2,
      },
    };

    // Not the same instance
    const actual = {
      a: 1,
      b: {
        c: 2,
      },
    };
    const matcher = equalTo(expected);

    assertThat(matcher.match(actual), matcherMatches());
  });

  it("fails if two objects are not deeply equal", () => {
    const expected = {
      a: 1,
      b: {
        c: 2,
      },
    };

    const actual = {
      a: 1,
      b: {
        c: 3,
      },
    };
    const matcher = equalTo(expected);

    const result = matcher.match(actual);
    assertThat(result, matcherDoesNotMatch());
    assertEqual(result, {
      matches: false,
      description: buildExpectedEqualToDescription(
        JSON.stringify(actual, null, 2),
        JSON.stringify(expected, null, 2),
      ),
      diff: {
        expected,
        actual,
      },
    });
  });

  it("fails if two strings are not deeply equal", () => {
    const expected = "something";
    const actual = "something else";
    const matcher = equalTo(expected);

    const result = matcher.match(actual);
    assertThat(result, matcherDoesNotMatch());
    assertEqual(result, {
      matches: false,
      description: buildExpectedEqualToDescription(
        "\"something else\"",
        "\"something\"",
      ),
      diff: {
        expected,
        actual,
      },
    });
  });

  it("matches if the given equality tester returns true", () => {
    const expected: string = "something";
    const actual = "something else";
    const test = sinon.stub().returns(true);
    const matcher = equalTo(expected, test);

    const result = matcher.match(actual);
    assertThat(result, matcherMatches());

    assertTrue(test.calledOnce);
    assertTrue(test.calledWithExactly(expected, actual));
  });

  it("fails if the given equality tester returns false", () => {
    const expected = "something";
    const test = sinon.stub().returns(false);
    const matcher = equalTo(expected, test);

    const result = matcher.match(expected);
    assertThat(result, matcherDoesNotMatch());
    assertEqual(result, {
      matches: false,
      description: buildExpectedEqualToDescription(
        "\"something\"",
        "\"something\"",
      ),
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
      description: buildExpectedEqualToDescription(
        "secondCall",
        "firstCall",
      ),
      diff: {
        expected,
        actual,
      },
    });
  });
});
