import { assertThat, DescriptionBuilder, equalTo, FailedMatchResult, hasProperty, is } from "../../../src";
import { MockMatcher, mockMatcherThatFails, mockMatcherThatMatches } from "../../MockMatcher";

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

  it("matches without knowing the keys", () => {
    const actual: { [key: string]: any } = {
      a: 1,
      b: 2,
    };

    const hasPropertyMatcher = hasProperty<{ [key: string]: any }, string>("b");
    const result = hasPropertyMatcher.match(actual);

    assertThat(result, equalTo({ matches: true }));
  });

  it("matches if the object has the property but the value is undefined", () => {
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
    const valueMatcher: MockMatcher<number | undefined> = mockMatcherThatMatches();

    const hasPropertyMatcher = hasProperty<O, "b">("b", valueMatcher);
    const result = hasPropertyMatcher.match(actual);

    assertThat(result, equalTo({ matches: true }));
    assertThat(valueMatcher.matchCalledCount, is(1));
    assertThat(valueMatcher.actual, is(2));
  });

  it("fails if the object does not have the property", () => {
    const actual: O = { a: 1 };

    const hasPropertyMatcher = hasProperty<O, "b">("b");
    const result = hasPropertyMatcher.match(actual);

    assertThat(result, equalTo({
      matches: false as false,
      description: new DescriptionBuilder()
        .setExpected(`an object with property "b"`)
        .setActual(JSON.stringify(actual, null, 2))
        .build(),
    }));
  });

  it("fails if the keys is present and the value matcher fails", () => {
    const valueMatchFailure: FailedMatchResult = {
      matches: false,
      description: new DescriptionBuilder()
        .setExpected("expected")
        .setActual("actual")
        .build(),
      diff: {
        expected: 1,
        actual: 2,
      },
    };
    const valueMatcher: MockMatcher<number | undefined> = mockMatcherThatFails(valueMatchFailure);
    const actual: O = {
      a: 1,
      b: 2,
    };

    const hasPropertyMatcher = hasProperty<O, "b">("b", valueMatcher);
    const result = hasPropertyMatcher.match(actual);

    assertThat(result, equalTo({
      matches: false as false,
      description: new DescriptionBuilder()
        .setExpected(`an object with property "b" matching expected`)
        .setActual("actual")
        .build(),
      diff: {
        expected: 1,
        actual: 2,
      },
    }));
  });
});
