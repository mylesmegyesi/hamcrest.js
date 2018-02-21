import { assertThat, equalTo, isPresent } from "../../src";

describe("IsPresent", () => {
  it("matches if the value is not null or undefined", () => {
    const result = isPresent<number>().match(1);

    assertThat(result, equalTo({ matches: true }));
  });

  it("fails if the value is null", () => {
    const result = isPresent<number>().match(null);

    assertThat(result, equalTo({ matches: false }));
  });

  it("fails if the value is undefined", () => {
    const result = isPresent<number>().match(undefined);

    assertThat(result, equalTo({ matches: false }));
  });

  it("matches if the value is not null or undefined and the value matcher matches", () => {
    const result = isPresent<number>(equalTo(1)).match(1);

    assertThat(result, equalTo({
      matches: true,
      diff: {
        expected: 1,
        actual: 1,
      },
    }));
  });

  it("fails if the value is not null or undefined and the value matcher fails", () => {
    const result = isPresent<number>(equalTo(2)).match(1);

    assertThat(result, equalTo({
      matches: false,
      diff: {
        expected: 2,
        actual: 1,
      },
    }));
  });
});
