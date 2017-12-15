import { anything, assertThat, DescriptionBuilder, equalTo } from "../../src";

describe("Anything", () => {
  it("always matches", () => {
    const matcher = anything();

    const matchResult = matcher.match(1);

    assertThat(matchResult, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("anything")
        .setActual("1")
        .build(),
    }));
  });
});
