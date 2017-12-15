import { assertThat, DescriptionBuilder, equalTo, isTrue, not } from "../../src";

describe("Not", () => {
  it("matches when the given matcher fails", () => {
    const matcher = not(isTrue());

    const result = matcher.match(false);

    assertThat(result, equalTo({
      matches: true,
      description: DescriptionBuilder()
        .setExpected("not true")
        .setActual("false")
        .build(),
    }));
  });

  it("fails when the given matcher matches", () => {
    const matcher = not(isTrue());

    const result = matcher.match(true);

    assertThat(result, equalTo({
      matches: false,
      description: DescriptionBuilder()
        .setExpected("not true")
        .setActual("true")
        .build(),
    }));
  });
});
