import { EOL } from "os";

import { assertThat, containsObject } from "../../src";
import {
  describesExtraLinesAs,
  matcherDescribesActualAs,
  matcherDescribesExpectedAs, matcherFails,
  matcherMatches,
} from "../../src/MatcherMatchers";
import { ObjectDifferenceAnalysis } from "../../src/matchers/ContainsObject";
import { MockMatcher } from "../../src/MockMatcher";

describe("ContainsObject", () => {
  type O = {
    a: number;
    b: number;
    c?: number;
  };

  it("matches when the object has all the properties", () => {
    const actual: O = { a: 1, b: 2 };

    const containsObjectMatcher = containsObject<O>({
      a: MockMatcher.matches(),
      b: MockMatcher.matches(),
    });

    assertThat(containsObjectMatcher, matcherMatches<O, ObjectDifferenceAnalysis<O>>().andReturnsData({
      failures: {},
      missing: {},
    }).given(actual));
  });

  it("matches only given property matchers for some of the required properties of the object", () => {
    const actual: O = { a: 1, b: 2 };
    const containsObjectMatcher = containsObject<O>({
      a: MockMatcher.matches(),
    });

    assertThat(containsObjectMatcher, matcherMatches<O, ObjectDifferenceAnalysis<O>>().andReturnsData({
      failures: {},
      missing: {},
    }).given(actual));
  });

  it("fails when a property is missing", () => {
    const actual: O = { a: 1, b: 2 };

    const containsObjectMatcher = containsObject<O>({
      a: MockMatcher.matches(),
      b: MockMatcher.matches(),
      c: MockMatcher.builder<number | undefined>()
        .setMatches(true)
        .setExpected("expected for c")
        .build(),
    });

    assertThat(containsObjectMatcher, matcherFails<O, ObjectDifferenceAnalysis<O>>().andReturnsData({
      failures: {},
      missing: {
        c: "expected for c",
      },
    }).given(actual));
  });

  it("matches when all the property matchers match", () => {
    const actual: O = { a: 1, b: 2 };

    const aMatcher = MockMatcher.matches();
    const bMatcher = MockMatcher.matches();

    const containsObjectMatcher = containsObject<O>({
      a: aMatcher,
      b: bMatcher,
    });

    assertThat(containsObjectMatcher, matcherMatches<O, ObjectDifferenceAnalysis<O>>().andReturnsData({
      failures: {},
      missing: {},
    }).given(actual));
  });

  it("fails when one property matcher fails", () => {
    const actual: O = { a: 1, b: 2 };
    const aMatcher = MockMatcher.builder()
      .setMatches(false)
      .setExpected("a1")
      .setActual("b1")
      .build();
    const bMatcher = MockMatcher.builder()
      .setMatches(true)
      .setExpected("a2")
      .setActual("b2")
      .build();
    const containsObjectMatcher = containsObject<O>({
      a: aMatcher,
      b: bMatcher,
    });

    assertThat(containsObjectMatcher, matcherFails<O, ObjectDifferenceAnalysis<O>>().andReturnsData({
      failures: {
        a: "b1",
      },
      missing: {},
    }).given(actual));
  });

  it("does not fail if there are extra keys", () => {
    const actual: O = { a: 1, b: 2, c: 3 };
    const containsObjectMatcher = containsObject<O>({
      a: MockMatcher.matches(),
      b: MockMatcher.matches(),
    });

    assertThat(containsObjectMatcher, matcherMatches<O, ObjectDifferenceAnalysis<O>>().andReturnsData({
      failures: {},
      missing: {},
    }).given(actual));
  });

  it("describes expected with an empty object", () => {
    const containsObjectMatcher = containsObject({});

    assertThat(containsObjectMatcher, matcherDescribesExpectedAs(
      `an object containing:${EOL}` +
      "{  }",
    ));
  });

  it("describes expected with one property", () => {
    const containsObjectMatcher = containsObject({
      a: MockMatcher.builder().setExpected("expected a").build(),
    });

    assertThat(containsObjectMatcher, matcherDescribesExpectedAs(
      `an object containing:${EOL}` +
      "{ a: expected a }",
    ));
  });

  it("describes expected with multiple properties", () => {
    const containsObjectMatcher = containsObject({
      a: MockMatcher.builder().setExpected("expected a").build(),
      b: MockMatcher.builder().setExpected("expected b").build(),
    });

    assertThat(containsObjectMatcher, matcherDescribesExpectedAs(
      `an object containing:${EOL}` +
      `{${EOL}` +
      `  a: expected a,${EOL}` +
      `  b: expected b${EOL}` +
      "}",
    ));
  });

  it("describes actual by printing the value", () => {
    const containsObjectMatcher = containsObject({
      a: MockMatcher.matches(),
      b: MockMatcher.matches(),
    });

    assertThat(containsObjectMatcher, matcherDescribesActualAs(
      `{${EOL}` +
      `  a: 2,${EOL}` +
      `  b: 1${EOL}` +
      "}",
    ).given(({ a: 2, b: 1 })));
  });

  it("describes data", () => {
    const aMatcher = MockMatcher.matches();
    const bMatcher = MockMatcher.matches();

    const containsObjectMatcher = containsObject<O>({
      a: aMatcher,
      b: bMatcher,
    });

    const data = {
      missing: { b: "expected value for b" },
      failures: { c: "actual value for c" },
    };

    assertThat(containsObjectMatcher, describesExtraLinesAs([
      {
        label: "failures",
        value: "{ c: actual value for c }",
      },
      {
        label: "missing",
        value: "{ b: expected value for b }",
      },
    ]).given(data));
  });
});
