import * as sinon from "sinon";

import { assertThat, DescriptionBuilder, is, matcherDoesNotMatch, matcherMatches } from "../../src";
import { assertEqual } from "../BootstrapAssertions";

describe("Is", () => {
  it("matches if Object.is returns true", () => {
    const matcher = is(1);

    assertThat(matcher.match(1), matcherMatches());
  });

  it("fails if Object.is returns false", () => {
    const matcher = is(+0);

    assertThat(matcher.match(-0), matcherDoesNotMatch());
  });

  it("prints using the toString function", () => {
    const toString = sinon.stub();
    toString.onFirstCall().returns("firstCall");
    toString.onSecondCall().returns("secondCall");

    const matcher = is(+0, toString);

    const result = matcher.match(-0);
    assertEqual(result, {
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("firstCall")
        .setActual("secondCall")
        .build(),
      diff: {
        expected: +0,
        actual: -0,
      },
    });
  });
});
