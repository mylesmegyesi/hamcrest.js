import { EOL } from "os";

import { assertThat, matchesObject } from "../../src";
import {
  describesExtraLinesAs,
  matcherDescribesActualAs,
  matcherDescribesExpectedAs,
  matcherFails,
  matcherMatches,
} from "../../src/MatcherMatchers";
import { ObjectDifferenceAnalysis } from "../../src/matchers/MatchesObject";
import {
  describeActualCalled,
  describeActualNotCalled,
  describeExpectedCalled,
  matchCalled,
  MockMatcher,
} from "../../src/MockMatcher";

describe("MatchesObject", () => {
  type O = {
    a: number;
    b: number;
    c?: number;
  };

  it("matches when all the property matchers match", () => {
    const actual: O = { a: 1, b: 2 };

    const aMatcher = MockMatcher.matches<number>();
    const bMatcher = MockMatcher.matches<number>();

    const matchesObjectMatcher = matchesObject<O>({
      a: aMatcher,
      b: bMatcher,
    });

    assertThat(matchesObjectMatcher, matcherMatches<O, ObjectDifferenceAnalysis<O>>().andReturnsData({
      extra: {},
      missing: {},
      failures: {},
    }).given(actual));

    assertThat(aMatcher, matchCalled({ actual: 1 }));
    assertThat(bMatcher, matchCalled({ actual: 2 }));
  });

  it("fails when one property matcher fails", () => {
    const actual: O = { a: 1, b: 2 };
    const aMatcher = MockMatcher.matches<number>();
    const bMatcher = MockMatcher.builder<number>()
      .setMatches(false)
      .setActual("b actual")
      .build();
    const matchesObjectMatcher = matchesObject<O>({
      a: aMatcher,
      b: bMatcher,
    });

    assertThat(matchesObjectMatcher, matcherFails<O, ObjectDifferenceAnalysis<O>>().andReturnsData({
      extra: {},
      missing: {},
      failures: { b: "b actual" },
    }).given(actual));

    assertThat(bMatcher, describeActualCalled({ actual: 2, data: undefined }));
  });

  it("fails if there are any extra keys", () => {
    const actual = {
      a: 1,
      b: 2,
      c: 3,
    };
    const aMatcher = MockMatcher.matches();
    const bMatcher = MockMatcher.matches();

    const matchesObjectMatcher = matchesObject<O>({
      a: aMatcher,
      b: bMatcher,
    });

    assertThat(matchesObjectMatcher, matcherFails<O, ObjectDifferenceAnalysis<O>>().andReturnsData({
      extra: { c: 3 },
      missing: {},
      failures: {},
    }).given(actual));
  });

  it("fails if there are any missing keys", () => {
    const actual = {
      a: 1,
      b: 2,
    };

    const aMatcher = MockMatcher.matches();
    const bMatcher = MockMatcher.matches();
    const cMatcher = MockMatcher.builder<number | undefined>()
      .setExpected("c expected")
      .build();

    const matchesObjectMatcher = matchesObject<O>({
      a: aMatcher,
      b: bMatcher,
      c: cMatcher,
    });

    assertThat(matchesObjectMatcher, matcherFails<O, ObjectDifferenceAnalysis<O>>().andReturnsData({
      extra: {},
      missing: { c: "c expected" },
      failures: {},
    }).given(actual));

    assertThat(cMatcher, describeExpectedCalled<number | undefined>(1));
  });

  it("describes expected", () => {
    const aMatcher = MockMatcher.builder()
      .setMatches(true)
      .setExpected("a value for a")
      .build();
    const bMatcher = MockMatcher.builder()
      .setMatches(true)
      .setExpected("a value for b")
      .build();

    const matchesObjectMatcher = matchesObject<O>({
      a: aMatcher,
      b: bMatcher,
    });

    assertThat(matchesObjectMatcher, matcherDescribesExpectedAs(
      `{${EOL}` +
      `  a: a value for a,${EOL}` +
      `  b: a value for b${EOL}` +
      `}`,
    ));

    assertThat(aMatcher, describeExpectedCalled(1));
    assertThat(bMatcher, describeExpectedCalled(1));
  });

  it("describes the actual by printing the value", () => {
    const actual: O = { a: 1, b: 2 };

    const aMatcher = MockMatcher.matches();
    const bMatcher = MockMatcher.matches();

    const matchesObjectMatcher = matchesObject<O>({
      a: aMatcher,
      b: bMatcher,
    });

    assertThat(matchesObjectMatcher, matcherDescribesActualAs(
      `{${EOL}` +
      `  a: 1,${EOL}` +
      `  b: 2${EOL}` +
      `}`,
    ).given(actual));

    assertThat(aMatcher, describeActualNotCalled());
    assertThat(bMatcher, describeActualNotCalled());
  });

  it("describes extra lines", () => {
    const aMatcher = MockMatcher.matches();
    const bMatcher = MockMatcher.matches();

    const matchesObjectMatcher = matchesObject<O>({
      a: aMatcher,
      b: bMatcher,
    });

    const data = {
      extra: { a: 1 },
      missing: { b: "expected value for b" },
      failures: { c: "actual value for c" },
    };

    assertThat(matchesObjectMatcher, describesExtraLinesAs([
      {
        label: "failures",
        value: "{ c: actual value for c }",
      },
      {
        label: "missing",
        value: "{ b: expected value for b }",
      },
      {
        label: "extra",
        value: "{ a: 1 }",
      },
    ]).given(data));
  });
})
;
