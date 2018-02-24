import { EOL } from "os";

import { assertThat, hasProperty } from "../../src";
import {
  matcherDescribesActualAs,
  matcherDescribesExpectedAs,
  matcherFails,
  matcherMatches,
} from "../../src/MatcherMatchers";
import { matchCalled, MockMatcher } from "../../src/MockMatcher";

describe("HasProperty", () => {
  type O = {
    a: number;
    b?: number;
  };

  it("matches if the object has the property", () => {
    const actual: O = {
      a: 1,
      b: 2,
    };

    const hasPropertyMatcher = hasProperty<O, "b">("b");

    assertThat(hasPropertyMatcher, matcherMatches().given(actual));
  });

  it("matches dynamically typed keys", () => {
    const actual: { [key: string]: any } = {
      a: 1,
      b: 2,
    };

    const hasPropertyMatcher = hasProperty<{ [key: string]: any }, string>("b");

    assertThat(hasPropertyMatcher, matcherMatches().given(actual));
  });

  it("matches if the object has the property but the value is undefined and no value matcher is given", () => {
    const actual: O = {
      a: 1,
      b: undefined,
    };

    const hasPropertyMatcher = hasProperty<O, "b">("b");

    assertThat(hasPropertyMatcher, matcherMatches().given(actual));
  });

  it("matches if the keys is present and the value matcher matches", () => {
    const actual: O = {
      a: 1,
      b: 2,
    };
    const valueMatcher = MockMatcher.matches<number | undefined>();

    const hasPropertyMatcher = hasProperty<O, "b">("b", valueMatcher);

    assertThat(hasPropertyMatcher, matcherMatches().given(actual));

    assertThat(valueMatcher, matchCalled<number | undefined>().with(2).times(1));
  });

  it("fails if the object does not have the property", () => {
    const actual: O = { a: 1 };

    const hasPropertyMatcher = hasProperty<O, "b">("b");

    assertThat(hasPropertyMatcher, matcherFails().given(actual));
  });

  it("fails if the keys is present and the value matcher fails", () => {
    const valueMatcher = MockMatcher.fails<number | undefined>();
    const actual: O = {
      a: 1,
      b: 2,
    };

    const hasPropertyMatcher = hasProperty<O, "b">("b", valueMatcher);

    assertThat(hasPropertyMatcher, matcherFails().given(actual));
  });

  it("describes expected - no value matcher", () => {
    const hasPropertyMatcher = hasProperty<O, "b">("b");

    assertThat(hasPropertyMatcher, matcherDescribesExpectedAs(`an object with property "b"`));
  });

  it("describes expected - with value matcher and a single line description", () => {
    const valueMatcher = MockMatcher.builder<number | undefined>()
      .setMatches(true)
      .setExpected("something")
      .build();
    const hasPropertyMatcher = hasProperty<O, "b">("b", valueMatcher);

    assertThat(hasPropertyMatcher, matcherDescribesExpectedAs(`an object with property "b" matching something`));
  });

  it("describes expected - with value matcher and a multi line description", () => {
    const valueMatcher = MockMatcher.builder<number | undefined>()
      .setMatches(true)
      .setExpected(`something1${EOL}something2`)
      .build();
    const hasPropertyMatcher = hasProperty<O, "b">("b", valueMatcher);

    assertThat(hasPropertyMatcher, matcherDescribesExpectedAs(
      `an object with property "b" matching:${EOL}` +
      `something1${EOL}` +
      `something2`,
    ));
  });

  it("describes actual by printing the value", () => {
    const actual: { [key: string]: any } = {
      a: 1,
      b: 2,
    };

    const hasPropertyMatcher = hasProperty<{ [key: string]: any }, string>("b");

    assertThat(hasPropertyMatcher, matcherDescribesActualAs(
      `{${EOL}` +
      `  a: 1,${EOL}` +
      `  b: 2${EOL}` +
      `}`,
    ).given(actual));
  });
});
