import { EOL } from "os";

import { assertThat, is, isTrue } from "../src";

import { assertFalse, assertThrows } from "./BootstrapAssertions";
import { mockMatcherThatFails, mockMatcherThatMatches } from "./MockMatcher";

describe("MatcherAssert", () => {
  it("assertThat does nothing when the matcher matches", () => {
    const matcher = mockMatcherThatMatches();

    assertThat(1, matcher);

    assertThat(matcher.actual, is(1));
    assertThat(matcher.matchCalledCount, is(1));
  });

  it("assertThat throws when the match fails", () => {
    const matcher = mockMatcherThatFails({
      matches: false,
      description: {
        expectedLabel: "Expected",
        expected: "something",
        actualLabel: "got",
        actual: "something else",
      },
    });

    assertThrows(() => { assertThat(1, matcher); }, e => {
      const expectedAssertionMessage =
        `Expected: something${EOL}` +
        "     got: something else";

      assertThat(e.message, is(expectedAssertionMessage));
      assertFalse(e.showDiff);
      assertThat(matcher.matchCalledCount, is(1));
    });
  });

  it("assertThat sets showDiff when return in the result", () => {
    const matcher = mockMatcherThatFails({
      matches: false,
      description: {
        expectedLabel: "Expected",
        expected: "something",
        actualLabel: "got",
        actual: "something else",
      },
      diff: {
        expected: "something",
        actual: "something else",
      },
    });

    assertThrows(() => { assertThat(1, matcher); }, e => {
      assertThat(e.showDiff, isTrue());
      assertThat(e.expected, is("something"));
      assertThat(e.actual, is("something else"));
    });
  });
});
