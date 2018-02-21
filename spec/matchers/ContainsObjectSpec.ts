import { EOL } from "os";

import { anything, assertThat, containsObject, DescriptionBuilder, equalTo, is } from "../../src";
import { MockMatcher } from "../MockMatcher";

describe("ContainsObject", () => {
  type O = {
    a: number;
    b: number;
    c?: number;
  };

  it("matches when the object has all the properties", () => {
    const actual: O = { a: 1, b: 2 };

    const containsObjectMatcher = containsObject<O>({
      a: MockMatcher.matches(),
      b: MockMatcher.matches(),
    });
    const result = containsObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      data: {
        failures: {},
        missing: {},
      },
    }));
  });

  it("matches only given property matchers for some of the required properties of the object", () => {
    const actual: O = { a: 1, b: 2 };

    const containsObjectMatcher = containsObject<O>({
      a: MockMatcher.matches(),
    });
    const result = containsObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      data: {
        failures: {},
        missing: {},
      },
    }));
  });

  it("fails when a property is missing", () => {
    const actual: O = { a: 1, b: 2 };

    const containsObjectMatcher = containsObject<O>({
      a: MockMatcher.matches(),
      b: MockMatcher.matches(),
      c: MockMatcher.builder<number | undefined>()
        .setMatches(true)
        .setExpected("expected for c")
        .build(),
    });
    const result = containsObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: false,
      data: {
        failures: {},
        missing: {
          c: "expected for c",
        },
      },
    }));
  });

  it("matches when all the property matchers match", () => {
    const actual: O = { a: 1, b: 2 };

    const aMatcher = MockMatcher.matches();
    const bMatcher = MockMatcher.matches();

    const containsObjectMatcher = containsObject<O>({
      a: aMatcher,
      b: bMatcher,
    });
    const result = containsObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      data: {
        failures: {},
        missing: {},
      },
    }));
    assertThat(aMatcher.matchCalledCount, is(1));
    assertThat(aMatcher.matchActual, is(1));
    assertThat(bMatcher.matchCalledCount, is(1));
    assertThat(bMatcher.matchActual, is(2));
  });

  it("fails when one property matcher fails", () => {
    const actual: O = { a: 1, b: 2 };
    const aMatcher = MockMatcher.builder()
      .setMatches(false)
      .setExpected("a1")
      .setActual("b1")
      .build();
    const bMatcher = MockMatcher.builder()
      .setMatches(true)
      .setExpected("a2")
      .setActual("b2")
      .build();

    const containsObjectMatcher = containsObject<O>({
      a: aMatcher,
      b: bMatcher,
    });
    const result = containsObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: false,
      data: {
        failures: {
          a: "b1",
        },
        missing: {},
      },
    }));
    assertThat(aMatcher.matchCalledCount, is(1));
    assertThat(aMatcher.matchActual, is(1));
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
      data: {
        failures: {},
        missing: {},
      },
    }));
  });

  it("describes expected with an empty object", () => {
    const containsObjectMatcher = containsObject({});

    assertThat(containsObjectMatcher.describeExpected(), is(
      `an object containing:${EOL}` +
      `{  }`,
    ));
  });

  it("describes expected with one property", () => {
    const containsObjectMatcher = containsObject({ a: anything() });

    assertThat(containsObjectMatcher.describeExpected(), is(
      `an object containing:${EOL}` +
      `{ a: anything }`,
    ));
  });

  it("describes expected with multiple properties", () => {
    const containsObjectMatcher = containsObject({
      a: anything(),
      b: equalTo(1),
    });

    assertThat(containsObjectMatcher.describeExpected(), is(
      `an object containing:${EOL}` +
      `{${EOL}` +
      `  a: anything,${EOL}` +
      `  b: 1${EOL}` +
      `}`,
    ));
  });

  it("describes actual by printing the value", () => {
    const containsObjectMatcher = containsObject({
      a: anything(),
      b: equalTo(1),
    });

    assertThat(containsObjectMatcher.describeActual({ a: 2, b: 1 }), is(
      `{${EOL}` +
      `  a: 2,${EOL}` +
      `  b: 1${EOL}` +
      `}`,
    ));
  });

  it("describes data", () => {
    const aMatcher = MockMatcher.matches();
    const bMatcher = MockMatcher.matches();

    const containsObjectMatcher = containsObject<O>({
      a: aMatcher,
      b: bMatcher,
    });

    const builder = new DescriptionBuilder("expected", "actual");

    const data = {
      missing: { b: "expected value for b" },
      failures: { c: "actual value for c" },
    };

    containsObjectMatcher.describeResult(data, builder);

    assertThat(builder.extraLines, equalTo([
      {
        label: "failures",
        value: "{ c: actual value for c }",
      },
      {
        label: "missing",
        value: "{ b: expected value for b }",
      },
    ]));
  });
});
