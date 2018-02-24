import { assertThat, strictlyEqualTo } from "../../src";
import {
  matcherDescribesActualAs,
  matcherDescribesExpectedAs,
  matcherFails,
  matcherMatches,
} from "../../src/MatcherMatchers";

describe("StrictlyEqualTo", () => {
  it("matches if two objects the same instance", () => {
    const value = { a: 1 };
    const matcher = strictlyEqualTo(value);

    assertThat(matcher, matcherMatches().andReturnsDiff({
      expected: value,
      actual: value,
    }).given(value));
  });

  it("fails if two objects are not strictly equal", () => {
    const expected = { a: 1 };
    const actual = { a: 1 };
    const matcher = strictlyEqualTo(expected);

    assertThat(matcher, matcherFails().andReturnsDiff({
      expected,
      actual,
    }).given(actual));
  });

  it("describes expected", () => {
    const matcher = strictlyEqualTo({ a: 1 });

    assertThat(matcher, matcherDescribesExpectedAs("{ a: 1 }"));
  });

  it("describes actual", () => {
    const value = { a: 1 };
    const matcher = strictlyEqualTo(value);

    assertThat(matcher, matcherDescribesActualAs("{ a: 1 }").given(value));
  });
});
