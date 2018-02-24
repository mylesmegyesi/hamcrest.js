import * as assert from "assert";
import { EOL } from "os";

import { AssertionError, assertThat } from "../src";

import { MockMatcher } from "../src/MockMatcher";

describe("MatcherAssert", () => {
  it("assertThat does nothing when the matcher matches", () => {
    const matcher = MockMatcher.builder()
      .setMatches(true)
      .setExpected("something")
      .setActual("something else")
      .build();

    assertThat(1, matcher);

    assert.deepEqual(matcher.matchArguments, { actual: 1 });
    assert.equal(matcher.matchCalledCount, 1);
  });

  it("assertThat throws when the match fails", () => {
    const matcher = MockMatcher.builder()
      .setMatches(false)
      .setExpected("something")
      .setActual("something else")
      .build();

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
    const matcher = MockMatcher.builder()
      .setMatches(false)
      .setExpected("something")
      .setActual("something else")
      .setDiff({
        expected: "something",
        actual: "something else",
      })
      .build();

    catchAssertionError(() => { assertThat(1, matcher); }, e => {
      assert.equal(e.showDiff, true);
      assert.equal(e.expected, "something");
      assert.equal(e.actual, "something else");
    });
  });
});
