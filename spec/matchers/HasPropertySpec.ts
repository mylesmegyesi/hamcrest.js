import { assertThat, FailedMatchResult, hasProperty, is, matcherDoesNotMatch, matcherMatches } from "../../src";
import { assertEqual } from "../BootstrapAssertions";
import { MockMatcher, mockMatcherThatFails, mockMatcherThatMatches } from "../MockMatcher";

describe("HasProperty", () => {
  type O = {
    a: number;
    b?: number;
  };

  it("matches if the object has the property", () => {
    const actual: O = {
      a: 1,
      b: 2,
    };

    const hasPropertyMatcher = hasProperty<O, "b">("b");

    assertThat(hasPropertyMatcher.match(actual), matcherMatches());
  });

  it("matches without knowing the keys", () => {
    const actual: { [key: string]: any } = {
      a: 1,
      b: 2,
    };

    const hasPropertyMatcher = hasProperty<{ [key: string]: any }, string>("b");

    assertThat(hasPropertyMatcher.match(actual), matcherMatches());
  });

  it("matches if the object has the property but the value is undefined", () => {
    const actual: O = {
      a: 1,
      b: undefined,
    };

    const hasPropertyMatcher = hasProperty<O, "b">("b");

    assertThat(hasPropertyMatcher.match(actual), matcherMatches());
  });

  it("matches if the keys is present and the value matcher matches", () => {
    const actual: O = {
      a: 1,
      b: 2,
    };
    const valueMatcher: MockMatcher<number | undefined> = mockMatcherThatMatches();

    const hasPropertyMatcher = hasProperty<O, "b">("b", valueMatcher);

    assertThat(hasPropertyMatcher.match(actual), matcherMatches());

    assertThat(valueMatcher.matchCalledCount, is(1));
    assertThat(valueMatcher.actual, is(2));
  });

  it("fails if the object does not have the property", () => {
    const actual: O = { a: 1 };

    const hasPropertyMatcher = hasProperty<O, "b">("b");

    const hasPropertyResult = hasPropertyMatcher.match(actual);

    assertThat(hasPropertyResult, matcherDoesNotMatch());

    assertEqual(hasPropertyResult, {
      matches: false,
      description: {
        expectedLabel: "Expected",
        expected: `an object with property "b"`,
        actualLabel: "got",
        actual: `{\n  \"a\": 1\n}`,
      },
    });
  });

  it("fails if the keys is present and the value matcher fails", () => {
    const valueMatchFailure: FailedMatchResult = {
      matches: false,
      description: {
        expectedLabel: "e",
        expected: "expected",
        actualLabel: "a",
        actual: "actual",
      },
      diff: {
        expected: 1,
        actual: 2,
      },
    };
    const valueMatcher: MockMatcher<number | undefined> = mockMatcherThatFails(valueMatchFailure);
    const actual: O = {
      a: 1,
      b: 2,
    };

    const hasPropertyMatcher = hasProperty<O, "b">("b", valueMatcher);

    const hasPropertyResult = hasPropertyMatcher.match(actual);

    assertThat(hasPropertyResult, matcherDoesNotMatch());

    assertEqual(hasPropertyResult, {
      matches: false,
      description: {
        expectedLabel: "Expected",
        expected: `an object with property "b" matching expected`,
        actualLabel: "got",
        actual: "actual",
      },
      diff: {
        expected: 1,
        actual: 2,
      },
    });
  });
});
