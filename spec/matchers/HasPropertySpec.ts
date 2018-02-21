import { EOL } from "os";

import { assertThat, equalTo, hasProperty, is } from "../../src";
import { MockMatcher } from "../MockMatcher";

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
    const result = hasPropertyMatcher.match(actual);

    assertThat(result, equalTo({ matches: true }));
  });

  it("matches dynamically typed keys", () => {
    const actual: { [key: string]: any } = {
      a: 1,
      b: 2,
    };

    const hasPropertyMatcher = hasProperty<{ [key: string]: any }, string>("b");
    const result = hasPropertyMatcher.match(actual);

    assertThat(result, equalTo({ matches: true }));
  });

  it("matches if the object has the property but the value is undefined and no value matcher is given", () => {
    const actual: O = {
      a: 1,
      b: undefined,
    };

    const hasPropertyMatcher = hasProperty<O, "b">("b");
    const result = hasPropertyMatcher.match(actual);

    assertThat(result, equalTo({ matches: true }));
  });

  it("matches if the keys is present and the value matcher matches", () => {
    const actual: O = {
      a: 1,
      b: 2,
    };
    const valueMatcher: MockMatcher<number | undefined> = MockMatcher.matches();

    const hasPropertyMatcher = hasProperty<O, "b">("b", valueMatcher);
    const result = hasPropertyMatcher.match(actual);

    assertThat(result, equalTo({ matches: true }));
    assertThat(valueMatcher.matchCalledCount, is(1));
    assertThat(valueMatcher.matchActual, is(2));
  });

  it("fails if the object does not have the property", () => {
    const actual: O = { a: 1 };

    const hasPropertyMatcher = hasProperty<O, "b">("b");
    const result = hasPropertyMatcher.match(actual);

    assertThat(result, equalTo({ matches: false }));
  });

  it("fails if the keys is present and the value matcher fails", () => {
    const valueMatcher: MockMatcher<number | undefined> = MockMatcher.fails();
    const actual: O = {
      a: 1,
      b: 2,
    };

    const hasPropertyMatcher = hasProperty<O, "b">("b", valueMatcher);
    const result = hasPropertyMatcher.match(actual);

    assertThat(result, equalTo({ matches: false }));
  });

  it("describes expected - no value matcher", () => {
    const hasPropertyMatcher = hasProperty<O, "b">("b");

    assertThat(hasPropertyMatcher.describeExpected(), is(`an object with property "b"`));
  });

  it("describes expected - with value matcher and a single line description", () => {
    const valueMatcher: MockMatcher<number | undefined> = MockMatcher.builder<number | undefined>()
      .setMatches(true)
      .setExpected("something")
      .build();
    const hasPropertyMatcher = hasProperty<O, "b">("b", valueMatcher);

    assertThat(hasPropertyMatcher.describeExpected(), is(`an object with property "b" matching something`));
  });

  it("describes expected - with value matcher and a multi line description", () => {
    const valueMatcher: MockMatcher<number | undefined> = MockMatcher.builder<number | undefined>()
      .setMatches(true)
      .setExpected(`something1${EOL}something2`)
      .build();
    const hasPropertyMatcher = hasProperty<O, "b">("b", valueMatcher);

    assertThat(hasPropertyMatcher.describeExpected(), is(
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

    assertThat(hasPropertyMatcher.describeActual(actual), is(
      `{${EOL}` +
      `  a: 1,${EOL}` +
      `  b: 2${EOL}` +
      `}`,
    ));
  });
});
