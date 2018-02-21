import { EOL } from "os";

import { assertThat, DescriptionBuilder, equalTo, is, matchesObject } from "../../src/index";
import { MockMatcher } from "../MockMatcher";

describe("MatchesObject", () => {
  type O = {
    a: number;
    b: number;
    c?: number;
  };

  it("matches when all the property matchers match", () => {
    const actual: O = { a: 1, b: 2 };

    const aMatcher = MockMatcher.matches();
    const bMatcher = MockMatcher.matches();

    const matchesObjectMatcher = matchesObject<O>({
      a: aMatcher,
      b: bMatcher,
    });
    const result = matchesObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      data: {
        extra: {},
        missing: {},
        failures: {},
      },
    }));
    assertThat(aMatcher.matchCalledCount, is(1));
    assertThat(aMatcher.matchActual, is(1));
    assertThat(bMatcher.matchCalledCount, is(1));
    assertThat(bMatcher.matchActual, is(2));
  });

  it("fails when one property matcher fails", () => {
    const actual: O = { a: 1, b: 2 };
    const aMatcher = MockMatcher.matches();
    const bMatcher = MockMatcher.builder()
      .setMatches(false)
      .setActual("b actual")
      .build();
    const matchesObjectMatcher = matchesObject<O>({
      a: aMatcher,
      b: bMatcher,
    });
    const result = matchesObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: false,
      data: {
        extra: {},
        missing: {},
        failures: { b: "b actual" },
      },
    }));

    assertThat(bMatcher.describeActualCalledCount, is(1));
  });

  it("fails if there are any extra keys", () => {
    const actual = {
      a: 1,
      b: 2,
      c: 3,
    };
    const aMatcher = MockMatcher.matches();
    const bMatcher = MockMatcher.matches();

    const matchesObjectMatcher = matchesObject<O>({
      a: aMatcher,
      b: bMatcher,
    });

    const result = matchesObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: false,
      data: {
        extra: { c: 3 },
        missing: {},
        failures: {},
      },
    }));
  });

  it("fails if there are any missing keys", () => {
    const actual = {
      a: 1,
      b: 2,
    };

    const aMatcher = MockMatcher.matches();
    const bMatcher = MockMatcher.matches();
    const cMatcher = MockMatcher.builder<number | undefined>()
      .setExpected("c expected")
      .build();

    const matchesObjectMatcher = matchesObject<O>({
      a: aMatcher,
      b: bMatcher,
      c: cMatcher,
    });

    const result = matchesObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: false as false,
      data: {
        extra: {},
        missing: { c: "c expected" },
        failures: {},
      },
    }));

    assertThat(cMatcher.describeExpectedCalledCount, is(1));
  });

  it("describes expected", () => {
    const aMatcher = MockMatcher.builder()
      .setMatches(true)
      .setExpected("a value for a")
      .build();
    const bMatcher = MockMatcher.builder()
      .setMatches(true)
      .setExpected("a value for b")
      .build();

    const matchesObjectMatcher = matchesObject<O>({
      a: aMatcher,
      b: bMatcher,
    });

    assertThat(
      matchesObjectMatcher.describeExpected(),
      is(
        `{${EOL}` +
        `  a: a value for a,${EOL}` +
        `  b: a value for b${EOL}` +
        `}`,
      ),
    );

    assertThat(aMatcher.describeExpectedCalledCount, is(1));
    assertThat(bMatcher.describeExpectedCalledCount, is(1));
  });

  it("describes the actual by printing the value", () => {
    const actual: O = { a: 1, b: 2 };

    const aMatcher = MockMatcher.matches();
    const bMatcher = MockMatcher.matches();

    const matchesObjectMatcher = matchesObject<O>({
      a: aMatcher,
      b: bMatcher,
    });

    assertThat(
      matchesObjectMatcher.describeActual(actual),
      is(
        `{${EOL}` +
        `  a: 1,${EOL}` +
        `  b: 2${EOL}` +
        `}`,
      ),
    );
    assertThat(aMatcher.describeActualCalledCount, is(0));
    assertThat(bMatcher.describeActualCalledCount, is(0));
  });

  it("describes data", () => {
    const aMatcher = MockMatcher.matches();
    const bMatcher = MockMatcher.matches();

    const matchesObjectMatcher = matchesObject<O>({
      a: aMatcher,
      b: bMatcher,
    });

    const builder = new DescriptionBuilder("expected", "actual");

    const data = {
      extra: { a: 1 },
      missing: { b: "expected value for b" },
      failures: { c: "actual value for c" },
    };

    matchesObjectMatcher.describeResult(data, builder);

    assertThat(builder.extraLines, equalTo([
      {
        label: "failures",
        value: "{ c: actual value for c }",
      },
      {
        label: "missing",
        value: "{ b: expected value for b }",
      },
      {
        label: "extra",
        value: "{ a: 1 }",
      },
    ]));
  });
})
;
