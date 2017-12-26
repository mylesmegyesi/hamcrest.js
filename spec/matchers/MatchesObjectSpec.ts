import { EOL } from "os";

import { anything, assertThat, DescriptionBuilder, equalTo, is, isPresent, matchesObject } from "../../src/index";
import { mockMatcher } from "../MockMatcher";

describe("MatchesObject", () => {
  type O = {
    a: number;
    b: number;
    c?: number;
  };

  it("matches when all the property matchers match", () => {
    const actual: O = { a: 1, b: 2 };

    const aMatcher = mockMatcher({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("a value for a")
        .setActual("not that")
        .build(),
    });
    const bMatcher = mockMatcher({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("a value for b")
        .setActual("something else")
        .build(),
    });

    const matchesObjectMatcher = matchesObject<O>({
      a: aMatcher,
      b: bMatcher,
    });
    const result = matchesObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected(
          `{${EOL}` +
          `  a: a value for a,${EOL}` +
          `  b: a value for b${EOL}` +
          `}`,
        )
        .setActual(
          `{${EOL}` +
          `  a: 1,${EOL}` +
          `  b: 2${EOL}` +
          `}`,
        )
        .build(),
    }));
    assertThat(aMatcher.matchCalledCount, is(1));
    assertThat(aMatcher.actual, is(1));
    assertThat(bMatcher.matchCalledCount, is(1));
    assertThat(bMatcher.actual, is(2));
  });

  it("fails when one property matcher fails", () => {
    const actual: O = { a: 1, b: 2 };
    const matchesObjectMatcher = matchesObject<O>({
      a: equalTo(1),
      b: mockMatcher({
        matches: false,
        description: DescriptionBuilder()
          .setExpected("3")
          .setActual("2")
          .build(),
      }),
    });
    const result = matchesObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected(
          `{${EOL}` +
          `  a: 1,${EOL}` +
          `  b: 3${EOL}` +
          `}`,
        )
        .setActual(
          `{${EOL}` +
          `  a: 1,${EOL}` +
          `  b: 2${EOL}` +
          `}`,
        )
        .addLine("failures", `{ b: 2 }`)
        .build(),
    }));
  });

  it("fails if there are any extra keys", () => {
    const actual = {
      a: 1,
      b: 2,
      c: 3,
    };

    const matchesObjectMatcher = matchesObject<O>({
      a: anything(),
      b: anything(),
    });

    const result = matchesObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected(
          `{${EOL}` +
          `  a: anything,${EOL}` +
          `  b: anything${EOL}` +
          `}`,
        )
        .setActual(
          `{${EOL}` +
          `  a: 1,${EOL}` +
          `  b: 2,${EOL}` +
          `  c: 3${EOL}` +
          `}`,
        )
        .addLine("extra", `{ c: 3 }`)
        .build(),
    }));
  });

  it("fails if there are any missing keys", () => {
    const actual = {
      a: 1,
      b: 2,
    };

    const matchesObjectMatcher = matchesObject<O>({
      a: anything(),
      b: anything(),
      c: isPresent(),
    });

    const result = matchesObjectMatcher.match(actual);

    assertThat(result, equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected(
          `{${EOL}` +
          `  a: anything,${EOL}` +
          `  b: anything,${EOL}` +
          `  c: not (null or undefined)${EOL}` +
          `}`,
        )
        .setActual(
          `{${EOL}` +
          `  a: 1,${EOL}` +
          `  b: 2${EOL}` +
          `}`,
        )
        .addLine("missing", `{ c: not (null or undefined) }`)
        .build(),
    }));
  });
});
