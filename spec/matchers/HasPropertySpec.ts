import { EOL } from "os";

import { assertThat, DescriptionBuilder, equalTo, FailedMatchResult, hasProperty, is, printValue } from "../../src";
import { MockMatcher, mockMatcher } from "../MockMatcher";

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

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected(`an object with property "b" matching anything`)
        .setActual(printValue(actual))
        .build(),
    }));
  });

  it("matches without knowing the keys", () => {
    const actual: { [key: string]: any } = {
      a: 1,
      b: 2,
    };

    const hasPropertyMatcher = hasProperty<{ [key: string]: any }, string>("b");
    const result = hasPropertyMatcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected(`an object with property "b" matching anything`)
        .setActual(printValue(actual))
        .build(),
    }));
  });

  it("matches if the object has the property but the value is undefined", () => {
    const actual: O = {
      a: 1,
      b: undefined,
    };

    const hasPropertyMatcher = hasProperty<O, "b">("b");
    const result = hasPropertyMatcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected(`an object with property "b" matching anything`)
        .setActual(printValue(actual))
        .build(),
    }));
  });

  it("matches if the keys is present and the value matcher matches", () => {
    const actual: O = {
      a: 1,
      b: 2,
    };
    const valueMatcher: MockMatcher<number | undefined> = mockMatcher({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("something")
        .setActual("something else")
        .build(),
    });

    const hasPropertyMatcher = hasProperty<O, "b">("b", valueMatcher);
    const result = hasPropertyMatcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected(`an object with property "b" matching something`)
        .setActual(printValue(actual))
        .build(),
    }));
    assertThat(valueMatcher.matchCalledCount, is(1));
    assertThat(valueMatcher.actual, is(2));
  });

  it("wraps the expected description if the property matcher contains a newline", () => {
    const actual: O = {
      a: 1,
      b: 2,
    };
    const valueMatcher: MockMatcher<number | undefined> = mockMatcher({
      matches: true,
      description: DescriptionBuilder()
        .setExpected(`some${EOL}thing`)
        .setActual("something else")
        .build(),
    });

    const hasPropertyMatcher = hasProperty<O, "b">("b", valueMatcher);
    const result = hasPropertyMatcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected(
          `an object with property "b" matching:${EOL}` +
          `  some${EOL}` +
          `  thing`,
        )
        .setActual(printValue(actual))
        .build(),
    }));
  });

  it("fails if the object does not have the property", () => {
    const actual: O = { a: 1 };

    const hasPropertyMatcher = hasProperty<O, "b">("b");
    const result = hasPropertyMatcher.match(actual);

    assertThat(result, equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected(`an object with property "b"`)
        .setActual(printValue(actual))
        .build(),
    }));
  });

  it("fails if the keys is present and the value matcher fails", () => {
    const valueMatchFailure: FailedMatchResult = {
      matches: false,
      description: DescriptionBuilder()
        .setExpected("expected")
        .setActual("actual")
        .build(),
      diff: {
        expected: 1,
        actual: 2,
      },
    };
    const valueMatcher: MockMatcher<number | undefined> = mockMatcher(valueMatchFailure);
    const actual: O = {
      a: 1,
      b: 2,
    };

    const hasPropertyMatcher = hasProperty<O, "b">("b", valueMatcher);
    const result = hasPropertyMatcher.match(actual);

    assertThat(result, equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected(`an object with property "b" matching expected`)
        .setActual(printValue(actual))
        .build(),
      diff: {
        expected: 1,
        actual: 2,
      },
    }));
  });
});
