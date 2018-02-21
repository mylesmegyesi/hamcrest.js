import { assertThat, equalTo, is, not } from "../../src";
import { MockMatcher } from "../MockMatcher";

describe("Not", () => {
  it("matches when the given matcher fails", () => {
    const wrappedMatcher = MockMatcher.builder()
      .setMatches(false)
      .setDiff({
        expected: 1,
        actual: 2,
      })
      .setData("data")
      .build();
    const matcher = not(wrappedMatcher);

    const result = matcher.match("actual");

    assertThat(result, equalTo({ matches: true }));

    assertThat(wrappedMatcher.matchCalledCount, is(1));
    assertThat(wrappedMatcher.matchActual, is("actual"));
  });

  it("fails when the given matcher matches", () => {
    const wrappedMatcher = MockMatcher.builder()
      .setMatches(true)
      .setDiff({
        expected: 1,
        actual: 2,
      })
      .setData("data")
      .build();
    const matcher = not(wrappedMatcher);

    const result = matcher.match("actual");

    assertThat(result, equalTo({ matches: false }));
  });

  it("describes the expected", () => {
    const wrappedMatcher = MockMatcher.builder()
      .setExpected("wrapped expected")
      .build();
    const matcher = not(wrappedMatcher);

    assertThat(matcher.describeExpected(), is("not wrapped expected"));
  });

  it("describes the actual", () => {
    const wrappedMatcher = MockMatcher.builder()
      .setActual("wrapped actual")
      .build();
    const matcher = not(wrappedMatcher);

    assertThat(matcher.describeActual("actual"), is("wrapped actual"));
  });
});
