import { anything, assertThat, DescriptionBuilder, FailedMatchResult, is, matcherDoesNotMatch, matcherMatches, matchesObject } from "../../src";
import { assertEqual } from "../BootstrapAssertions";
import { mockMatcherThatFails, mockMatcherThatMatches } from "../MockMatcher";

describe("MatchesObject", () => {
  type O = {
    a: number;
    b: number;
    c?: number;
  };

  it("matches when all the property matchers match", () => {
    const actual: O = { a: 1, b: 2 };

    const aMatcher = mockMatcherThatMatches();
    const bMatcher = mockMatcherThatMatches();

    const matchesObjectMatcher = matchesObject<O, keyof O>({
      a: aMatcher,
      b: bMatcher,
    });

    assertThat(matchesObjectMatcher.match(actual), matcherMatches());

    assertThat(aMatcher.matchCalledCount, is(1));
    assertThat(aMatcher.actual, is(1));
    assertThat(bMatcher.matchCalledCount, is(1));
    assertThat(bMatcher.actual, is(2));
  });

  it("fails when one property matcher fails", () => {
    const actual: O = { a: 1, b: 2 };
    const expectedFailureResult: FailedMatchResult = {
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("a")
        .setActual("b")
        .build(),
      diff: {
        expected: 1,
        actual: 2,
      },
    };

    const aMatcher = mockMatcherThatFails(expectedFailureResult);
    const bMatcher = mockMatcherThatMatches();

    const matchesObjectMatcher = matchesObject<O, keyof O>({
      a: aMatcher,
      b: bMatcher,
    });

    const hasPropertiesResult = matchesObjectMatcher.match(actual);

    assertThat(hasPropertiesResult, matcherDoesNotMatch());

    assertEqual(hasPropertiesResult, {
      matches: false,
      description: new DescriptionBuilder()
        .setExpected(`an object with property "a" matching a`)
        .setActual("b")
        .build(),
      diff: {
        expected: 1,
        actual: 2,
      },
    });

    assertThat(aMatcher.matchCalledCount, is(1));
    assertThat(aMatcher.actual, is(1));
    assertThat(bMatcher.matchCalledCount, is(0));
  });

  it("fails if there are any extra keys", () => {
    const actual = {
      a: 1,
      b: 2,
      c: 3,
    };

    const matchesObjectMatcher = matchesObject<O, keyof O>({
      a: anything(),
      b: anything(),
    });

    const result = matchesObjectMatcher.match(actual);

    assertThat(result, matcherDoesNotMatch());

    assertEqual(result, {
      matches: false,
      description: new DescriptionBuilder()
        .setExpected(`an object with only these properties: [ "a", "b" ]`)
        .setActual(JSON.stringify(actual, null, 2))
        .addLine("overlap", `[ "a", "b" ]`)
        .addLine("extra", `[ "c" ]`)
        .addLine("missing", `[ ]`)
        .build(),
      diff: {
        expected: [
          "a",
          "b",
        ],
        actual: [
          "a",
          "b",
          "c",
        ],
      },
    });
  });

  it("fails if there are any missing keys", () => {
    const actual = {
      a: 1,
      b: 2,
    };

    const matchesObjectMatcher = matchesObject<O, keyof O>({
      a: anything(),
      b: anything(),
      c: anything(),
    });

    const result = matchesObjectMatcher.match(actual);

    assertThat(result, matcherDoesNotMatch());

    assertEqual(result, {
      matches: false,
      description: new DescriptionBuilder()
        .setExpected(`an object with only these properties: [ "a", "b", "c" ]`)
        .setActual(JSON.stringify(actual, null, 2))
        .addLine("overlap", `[ "a", "b" ]`)
        .addLine("extra", `[ ]`)
        .addLine("missing", `[ "c" ]`)
        .build(),
      diff: {
        expected: [
          "a",
          "b",
          "c",
        ],
        actual: [
          "a",
          "b",
        ],
      },
    });
  });
});
