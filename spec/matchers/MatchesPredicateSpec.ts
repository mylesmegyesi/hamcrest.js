import * as sinon from "sinon";

import { assertThat, equalTo, is, isTrue, matches } from "../../src";

describe("MatchesPredicate", () => {
  it("matches if the given predicate returns true", () => {
    const expected = "something";
    const actual = "something else";
    const test = sinon.stub().returns(true);
    const matcher = matches<string, string>(expected, test);

    const result = matcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      diff: {
        expected,
        actual,
      },
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
      matches: false,
      diff: {
        expected,
        actual: expected,
      },
    }));
  });

  it("describes the expected by printing the value", () => {
    const matcher = matches<string, string>("something", (e, a) => true);

    assertThat(matcher.describeExpected(), is("\"something\""));
  });

  it("describes the actual by printing the value", () => {
    const matcher = matches<string, string>("something", (e, a) => true);

    assertThat(matcher.describeActual("something else"), is("\"something else\""));
  });
});
