import { anything, assertThat, DescriptionBuilder, equalTo, hasProperties, is, printValue } from "../../src/index";
import { mockMatcher } from "../MockMatcher";

describe("HasProperties", () => {
  type O = {
    a: number;
    b: number;
    c?: number;
  };

  it("matches when the object has all the properties", () => {
    const actual: O = { a: 1, b: 2 };

    const hasPropertiesMatcher = hasProperties<O>({
      a: anything(),
      b: anything(),
    });
    const result = hasPropertiesMatcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("(anything and anything)")
        .setActual(printValue(actual))
        .build(),
    }));
  });

  it("matches only given property matchers for some of the required properties of the object", () => {
    const actual: O = { a: 1, b: 2 };

    const hasPropertiesMatcher = hasProperties<O>({
      a: anything(),
    });
    const result = hasPropertiesMatcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("anything")
        .setActual("1")
        .build(),
    }));
  });

  it("fails when a property is missing", () => {
    const actual: O = { a: 1, b: 2 };

    const hasPropertiesMatcher = hasProperties<O>({
      a: anything(),
      b: anything(),
      c: anything(),
    });
    const result = hasPropertiesMatcher.match(actual);

    assertThat(result, equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected(`an object with property "c"`)
        .setActual(printValue(actual))
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

    const hasPropertiesMatcher = hasProperties<O>({
      a: aMatcher,
      b: bMatcher,
    });
    const result = hasPropertiesMatcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("(a1 and a2)")
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

    const hasPropertiesMatcher = hasProperties<O>({
      a: aMatcher,
      b: bMatcher,
    });
    const result = hasPropertiesMatcher.match(actual);

    assertThat(result, equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected(`an object with property "a" matching a1`)
        .setActual(printValue(actual))
        .build(),
      diff: {
        expected: 1,
        actual: 2,
      },
    }));
    assertThat(aMatcher.matchCalledCount, is(1));
    assertThat(aMatcher.actual, is(1));
    assertThat(bMatcher.matchCalledCount, is(0));
  });
});
