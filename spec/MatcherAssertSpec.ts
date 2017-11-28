import { EOL } from "os";

import { assertThat } from "../src";

import { assertSame, assertThrows } from "./BootstrapAssertions";
import { mockMatcherThatFails, mockMatcherThatMatches } from "./MockMatcher";

describe("MatcherAssert", () => {
  it("assertThat does nothing when the matcher matches", () => {
    const matcher = mockMatcherThatMatches();

    assertThat(1, matcher);

    assertSame(1, matcher.actual);
    assertSame(1, matcher.matchCalledCount);
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

      assertSame(expectedAssertionMessage, e.message);
      assertSame(false, e.showDiff);
      assertSame(1, matcher.matchCalledCount);
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
      assertSame(true, e.showDiff);
      assertSame("something", e.expected);
      assertSame("something else", e.actual);
    });
  });
});
