import { assertThat, equalTo } from "../../src";
import {
  matcherDescribesActualAs,
  matcherDescribesExpectedAs,
  matcherFails,
  matcherMatches,
} from "../../src/MatcherMatchers";

describe("EqualTo", () => {
  it("matches if two objects have the same value", () => {
    const actual = { a: 1 };
    const expected = { a: 1 };
    const matcher = equalTo(expected);

    assertThat(matcher, matcherMatches().andReturnsDiff({
      expected,
      actual,
    }).given(actual));
  });

  it("fails if two objects do not have the same value", () => {
    const actual = { a: 1 };
    const expected = { a: 2 };
    const matcher = equalTo(expected);

    assertThat(matcher, matcherFails().andReturnsDiff({
      expected,
      actual,
    }).given(actual));
  });

  it("describes the expected by printing the value", () => {
    const matcher = equalTo({ a: 2 });

    assertThat(matcher, matcherDescribesExpectedAs("{ a: 2 }"));
  });

  it("describes the actual by printing the value", () => {
    const matcher = equalTo({ a: 2 });

    assertThat(matcher, matcherDescribesActualAs("{ a: 1 }").given({ a: 1 }));
  });
});
