import {
  anything,
  assertThat,
  FailedMatchResult,
  hasProperties,
  is,
  matcherDoesNotMatch,
  matcherMatches,
} from "../../src";
import { assertEqual } from "../BootstrapAssertions";
import { mockMatcherThatFails, mockMatcherThatMatches } from "../MockMatcher";

describe("HasProperties", () => {
  type O = {
    a: number;
    b: number;
    c?: number;
  };

  it("matches when the object has all the properties", () => {
    const actual: O = { a: 1, b: 2 };

    const hasPropertiesMatcher = hasProperties<O>({
      a: anything(),
      b: anything(),
    });

    assertThat(hasPropertiesMatcher.match(actual), matcherMatches());
  });

  it("matches only given property matchers for some of the required properties of the object", () => {
    const actual: O = { a: 1, b: 2 };

    const hasPropertiesMatcher = hasProperties<O>({
      a: anything(),
    });

    assertThat(hasPropertiesMatcher.match(actual), matcherMatches());
  });

  it("fails when a property is missing", () => {
    const actual: O = { a: 1, b: 2 };

    const hasPropertiesMatcher = hasProperties<O>({
      a: anything(),
      b: anything(),
      c: anything(),
    });

    const hasPropertiesResult = hasPropertiesMatcher.match(actual);

    assertThat(hasPropertiesResult, matcherDoesNotMatch());
    assertEqual(hasPropertiesResult, {
      matches: false,
      description: {
        expectedLabel: "Expected",
        expected: `an object with property "c"`,
        actualLabel: "got",
        actual: JSON.stringify(actual, null, 2),
      },
    });
  });

  it("matches when all the property matchers match", () => {
    const actual: O = { a: 1, b: 2 };

    const aMatcher = mockMatcherThatMatches();
    const bMatcher = mockMatcherThatMatches();

    const hasPropertiesMatcher = hasProperties<O>({
      a: aMatcher,
      b: bMatcher,
    });

    assertThat(hasPropertiesMatcher.match(actual), matcherMatches());

    assertThat(aMatcher.matchCalledCount, is(1));
    assertThat(aMatcher.actual, is(1));
    assertThat(bMatcher.matchCalledCount, is(1));
    assertThat(bMatcher.actual, is(2));
  });

  it("matches when one property matcher fails", () => {
    const actual: O = { a: 1, b: 2 };
    const expectedFailureResult: FailedMatchResult = {
      matches: false,
      description: {
        expectedLabel: "e",
        expected: "a",
        actualLabel: "a",
        actual: "b",
      },
      diff: {
        expected: 1,
        actual: 2,
      },
    };

    const aMatcher = mockMatcherThatFails(expectedFailureResult);
    const bMatcher = mockMatcherThatMatches();

    const hasPropertiesMatcher = hasProperties<O>({
      a: aMatcher,
      b: bMatcher,
    });

    const hasPropertiesResult = hasPropertiesMatcher.match(actual);

    assertThat(hasPropertiesResult, matcherDoesNotMatch());

    assertEqual(hasPropertiesResult, {
      matches: false,
      description: {
        expectedLabel: "Expected",
        expected: `an object with property "a" matching a`,
        actualLabel: "got",
        actual: "b",
      },
      diff: {
        expected: 1,
        actual: 2,
      },
    });

    assertThat(aMatcher.matchCalledCount, is(1));
    assertThat(aMatcher.actual, is(1));
    assertThat(bMatcher.matchCalledCount, is(0));
  });
});
