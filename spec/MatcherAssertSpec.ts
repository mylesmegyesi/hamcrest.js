import { EOL } from "os";

import { assertThat, DescriptionBuilder, is, isFalse, isTrue } from "../src";

import { assertThrows } from "./BootstrapAssertions";
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
      description: new DescriptionBuilder()
        .setExpected("something")
        .setActual("something else")
        .build(),
    });

    assertThrows(() => { assertThat(1, matcher); }, e => {
      const expectedAssertionMessage = `${EOL}` +
        `Expected: something${EOL}` +
        `     got: something else${EOL}`;

      assertThat(e.message, is(expectedAssertionMessage));
      assertThat(e.showDiff, isFalse());
      assertThat(matcher.matchCalledCount, is(1));
    });
  });

  it("assertThat sets showDiff when return in the result", () => {
    const matcher = mockMatcherThatFails({
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("something")
        .setActual("something else")
        .build(),
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
