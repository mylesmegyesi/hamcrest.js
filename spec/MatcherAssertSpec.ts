import * as assert from "assert";
import { EOL } from "os";

import { AssertionError, assertThat, DescriptionBuilder } from "../src";

import { mockMatcherThatFails, mockMatcherThatMatches } from "./MockMatcher";

describe("MatcherAssert", () => {
  it("assertThat does nothing when the matcher matches", () => {
    const matcher = mockMatcherThatMatches();

    assertThat(1, matcher);

    assert.equal(matcher.actual, 1);
    assert.equal(matcher.matchCalledCount, 1);
  });

  it("assertThat throws when the match fails", () => {
    const matcher = mockMatcherThatFails({
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("something")
        .setActual("something else")
        .build(),
    });

    catchAssertionError(() => { assertThat(1, matcher); }, e => {
      const expectedAssertionMessage = `${EOL}` +
        `Expected: something${EOL}` +
        `     got: something else${EOL}`;

      assert.equal(e.message, expectedAssertionMessage);
      assert.equal(e.showDiff, false);
      assert.equal(e.expected, undefined);
      assert.equal(e.actual, undefined);
      assert.equal(matcher.matchCalledCount, 1);
    });
  });

  function catchAssertionError(f: () => void, matcher: (e: AssertionError) => void): void {
    let thrownError: AssertionError | null = null;
    try {
      f();
    } catch (e) {
      if (!(e instanceof AssertionError)) {
        throw e;
      }

      thrownError = e;
    }

    if (!thrownError) {
      throw new Error("did not throw");
    }

    matcher(thrownError);
  }

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

    catchAssertionError(() => { assertThat(1, matcher); }, e => {
      assert.equal(e.showDiff, true);
      assert.equal(e.expected, "something");
      assert.equal(e.actual, "something else");
    });
  });
});
