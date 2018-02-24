import * as assert from "assert";

import { assertThat, matches } from "../../src";
import {
  matcherDescribesActualAs,
  matcherDescribesExpectedAs,
  matcherFails,
  matcherMatches,
} from "../../src/MatcherMatchers";

describe("MatchesPredicate", () => {
  it("matches if the given predicate returns true", () => {
    let callCount = 0;
    let receivedExpectedValue = null;
    let receivedActualValue = null;
    const test = (expected: number, actual: number): boolean => {
      callCount += 1;
      receivedExpectedValue = expected;
      receivedActualValue = actual;
      return true;
    };
    const matcher = matches<number, number>(1, test);

    assertThat(matcher, matcherMatches().andReturnsDiff({
      expected: 1,
      actual: 2,
    }).given(2));

    assert.equal(callCount, 1);
    assert.equal(receivedExpectedValue, 1);
    assert.equal(receivedActualValue, 2);
  });

  it("fails if the given equality tester returns false", () => {
    const test = (_1: number, _2: number): boolean => false;

    const matcher = matches<number, number>(1, test);

    assertThat(matcher, matcherFails().andReturnsDiff({
      expected: 1,
      actual: 2,
    }).given(2));
  });

  it("describes the expected by printing the value", () => {
    const matcher = matches<string, string>("something", (e, a) => true);

    assertThat(matcher, matcherDescribesExpectedAs("\"something\""));
  });

  it("describes the actual by printing the value", () => {
    const matcher = matches<string, string>("something", (e, a) => true);

    assertThat(matcher, matcherDescribesActualAs("\"something else\"").given("something else"));
  });
});
