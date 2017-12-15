import { assertThat, DescriptionBuilder, equalTo, looselyEqualTo } from "../../src";

describe("LooselyEqualTo", () => {
  it("matches if two objects are loosely equal", () => {
    const value: string = "";

    const result = looselyEqualTo<string, number>(value).match(0);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected(`""`)
        .setActual("0")
        .build(),
    }));
  });

  it("fails if two objects are not loosely equal", () => {
    const matcher = looselyEqualTo(Number.NaN);

    assertThat(matcher.match(Number.NaN), equalTo({
      matches: false as false,
      description: DescriptionBuilder()
        .setExpected(Number.NaN.toString())
        .setActual(Number.NaN.toString())
        .build(),
      diff: {
        expected: Number.NaN,
        actual: Number.NaN,
      },
    }));
  });
});
