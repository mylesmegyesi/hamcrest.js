import { EOL } from "os";

import { anything, assertThat, containsObject, DescriptionBuilder, equalTo, is, printValue } from "../../src";
import { mockMatcher } from "../MockMatcher";

describe("ContainsObject", () => {
  type O = {
    a: number;
    b: number;
    c?: number;
  };

  it("matches when the object has all the properties", () => {
    const actual: O = { a: 1, b: 2 };

    const containsObjectMatcher = containsObject<O>({
      a: anything(),
      b: anything(),
    });
    const result = containsObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected(
          `an object containing:${EOL}` +
          `{${EOL}` +
          `  a: anything,${EOL}` +
          `  b: anything${EOL}` +
          `}`,
        )
        .setActual(printValue(actual))
        .build(),
    }));
  });

  it("matches only given property matchers for some of the required properties of the object", () => {
    const actual: O = { a: 1, b: 2 };

    const containsObjectMatcher = containsObject<O>({
      a: anything(),
    });
    const result = containsObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected(
          `an object containing:${EOL}` +
          `{ a: anything }`,
        )
        .setActual(printValue(actual))
        .build(),
    }));
  });

  it("fails when a property is missing", () => {
    const actual: O = { a: 1, b: 2 };

    const containsObjectMatcher = containsObject<O>({
      a: anything(),
      b: anything(),
      c: anything(),
    });
    const result = containsObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected(
          `an object containing:${EOL}` +
          `{${EOL}` +
          `  a: anything,${EOL}` +
          `  b: anything,${EOL}` +
          `  c: anything${EOL}` +
          `}`,
        )
        .setActual(printValue(actual))
        .addLine("missing", `{ c: anything }`)
        .build(),
    }));
  });

  it("matches when all the property matchers match", () => {
    const actual: O = { a: 1, b: 2 };

    const aMatcher = mockMatcher({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("a1")
        .setActual("b1")
        .build(),
    });
    const bMatcher = mockMatcher({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("a2")
        .setActual("b2")
        .build(),
    });

    const containsObjectMatcher = containsObject<O>({
      a: aMatcher,
      b: bMatcher,
    });
    const result = containsObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected(
          `an object containing:${EOL}` +
          `{${EOL}` +
          `  a: a1,${EOL}` +
          `  b: a2${EOL}` +
          `}`,
        )
        .setActual(printValue(actual))
        .build(),
    }));
    assertThat(aMatcher.matchCalledCount, is(1));
    assertThat(aMatcher.actual, is(1));
    assertThat(bMatcher.matchCalledCount, is(1));
    assertThat(bMatcher.actual, is(2));
  });

  it("fails when one property matcher fails", () => {
    const actual: O = { a: 1, b: 2 };
    const aMatcher = mockMatcher({
      matches: false,
      description: DescriptionBuilder()
        .setExpected("a1")
        .setActual("b1")
        .build(),
      diff: {
        expected: 1,
        actual: 2,
      },
    });
    const bMatcher = mockMatcher({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("a2")
        .setActual("b2")
        .build(),
    });

    const containsObjectMatcher = containsObject<O>({
      a: aMatcher,
      b: bMatcher,
    });
    const result = containsObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected(
          `an object containing:${EOL}` +
          `{${EOL}` +
          `  a: a1,${EOL}` +
          `  b: a2${EOL}` +
          `}`,
        )
        .setActual(printValue(actual))
        .addLine("failures", `{ a: b1 }`)
        .build(),
    }));
    assertThat(aMatcher.matchCalledCount, is(1));
    assertThat(aMatcher.actual, is(1));
    assertThat(bMatcher.matchCalledCount, is(1));
  });

  it("does not fail if there are extra keys", () => {
    const actual: O = { a: 1, b: 2, c: 3 };

    const containsObjectMatcher = containsObject<O>({
      a: equalTo(1),
      b: equalTo(2),
    });
    const result = containsObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected(
          `an object containing:${EOL}` +
          `{${EOL}` +
          `  a: 1,${EOL}` +
          `  b: 2${EOL}` +
          `}`,
        )
        .setActual(printValue(actual))
        .build(),
    }));
  });
});
