import * as sinon from "sinon";

import { assertThat, DescriptionBuilder, equalTo, isTrue, matches } from "../../src";

describe("MatchesPredicate", () => {
  it("matches if the given predicate returns true", () => {
    const expected = "something";
    const actual = "something else";
    const test = sinon.stub().returns(true);
    const matcher = matches<string, string>(expected, test);

    const result = matcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("\"something\"")
        .setActual("\"something else\"")
        .build(),
    }));
    assertThat(test.calledOnce, isTrue());
    assertThat(test.calledWithExactly(expected, actual), isTrue());
  });

  it("fails if the given equality tester returns false", () => {
    const expected = "something";
    const test = sinon.stub().returns(false);

    const matcher = matches<string, string>(expected, test);
    const result = matcher.match(expected);

    assertThat(result, equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected("\"something\"")
        .setActual("\"something\"")
        .build(),
      diff: {
        expected,
        actual: expected,
      },
    }));
  });
});
