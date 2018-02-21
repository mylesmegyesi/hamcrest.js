import { EOL } from "os";

import { assertThat, contains } from "../../src";
import {
  matcherDescribesActualAs,
  matcherDescribesExpectedAs,
  matcherFails,
  matcherMatches,
} from "../../src/MatcherMatchers";
import { describeExpectedCalled, matchCalled, matchNotCalled, MockMatcher } from "../../src/MockMatcher";

describe("contains", () => {
  it("matches if the any of the inputs match the given matcher", () => {
    const matcher1 = MockMatcher.builder<number>()
      .setMatchesTest(actual => actual === 1)
      .build();
    const containsMatcher = contains(matcher1);

    assertThat(containsMatcher, matcherMatches().given([2, 1]));

    assertThat(matcher1, matchCalled({ actual: 2 }, { actual: 1 }));
  });

  it("matches if all of the given matchers match at least one input", () => {
    const matcher1 = MockMatcher.builder<number>()
      .setMatchesTest(actual => actual === 1)
      .build();
    const matcher2 = MockMatcher.builder<number>()
      .setMatchesTest(actual => actual === 2)
      .build();
    const matcher3 = MockMatcher.builder<number>()
      .setMatchesTest(actual => actual === 3)
      .build();
    const containsMatcher = contains(matcher1, matcher2, matcher3);

    assertThat(containsMatcher, matcherMatches().given([3, 2, 1]));

    assertThat(matcher1, matchCalled({ actual: 3 }, { actual: 2 }, { actual: 1 }));
    assertThat(matcher2, matchCalled({ actual: 3 }, { actual: 2 }));
    assertThat(matcher3, matchCalled({ actual: 3 }));
  });

  it("matches with duplicates", () => {
    const matcher1 = MockMatcher.builder<number>()
      .setMatchesTest(actual => actual === 1)
      .build();
    const matcher2 = MockMatcher.builder<number>()
      .setMatchesTest(actual => actual === 2)
      .build();
    const matcher3 = MockMatcher.builder<number>()
      .setMatchesTest(actual => actual === 2)
      .build();
    const containsMatcher = contains(matcher1, matcher2, matcher3);

    assertThat(containsMatcher, matcherMatches().given([1, 2, 2]));

    assertThat(matcher1, matchCalled({ actual: 1 }));
    assertThat(matcher2, matchCalled({ actual: 2 }));
    assertThat(matcher2, matchCalled({ actual: 2 }));
  });

  it("fails if none of the inputs match the given matcher", () => {
    const matcher1 = MockMatcher.builder<number>()
      .setMatchesTest(actual => actual === 3)
      .build();
    const containsMatcher = contains(matcher1);

    assertThat(containsMatcher, matcherFails().given([2, 1]));

    assertThat(matcher1, matchCalled({ actual: 2 }, { actual: 1 }));
  });

  it("fails if none of the inputs match the given matchers", () => {
    const matcher1 = MockMatcher.builder<number>()
      .setMatchesTest(actual => actual === 1)
      .build();
    const matcher2 = MockMatcher.builder<number>()
      .setMatchesTest(actual => actual === 2)
      .build();
    const matcher3 = MockMatcher.builder<number>()
      .setMatchesTest(actual => actual === 3)
      .build();
    const containsMatcher = contains(matcher1, matcher2, matcher3);

    assertThat(containsMatcher, matcherFails().given([4, 5, 6]));

    assertThat(matcher1, matchCalled({ actual: 4 }, { actual: 5 }, { actual: 6 }));
    assertThat(matcher2, matchCalled({ actual: 4 }, { actual: 5 }, { actual: 6 }));
    assertThat(matcher3, matchCalled({ actual: 4 }, { actual: 5 }, { actual: 6 }));
  });

  it("fails with duplicate matchers that match only one item", () => {
    const matcher1 = MockMatcher.builder<number>()
      .setMatchesTest(actual => actual === 2)
      .build();
    const matcher2 = MockMatcher.builder<number>()
      .setMatchesTest(actual => actual === 2)
      .build();
    const containsMatcher = contains(matcher1, matcher2);

    assertThat(containsMatcher, matcherFails().given([2]));

    assertThat(matcher1, matchCalled({ actual: 2 }));
    assertThat(matcher2, matchNotCalled());
  });

  it("describes expected with one matcher", () => {
    const matcher = MockMatcher.builder<number>()
      .setExpected("expected value")
      .build();
    const containsMatcher = contains(matcher);

    assertThat(containsMatcher, matcherDescribesExpectedAs(
      `an Iterable containing:${EOL}` +
      `[${EOL}` +
      `  expected value${EOL}` +
      `]`,
    ));

    assertThat(matcher, describeExpectedCalled(1));
  });

  it("describes expected with multiple matchers", () => {
    const matcher1 = MockMatcher.builder<number>()
      .setExpected("expected value 1")
      .build();
    const matcher2 = MockMatcher.builder<number>()
      .setExpected("expected value 2")
      .build();
    const matcher3 = MockMatcher.builder<number>()
      .setExpected("expected value 3")
      .build();
    const containsMatcher = contains(matcher1, matcher2, matcher3);

    assertThat(containsMatcher, matcherDescribesExpectedAs(
      `an Iterable containing:${EOL}` +
      `[${EOL}` +
      `  expected value 1,${EOL}` +
      `  expected value 2,${EOL}` +
      `  expected value 3${EOL}` +
      `]`,
    ));

    assertThat(matcher1, describeExpectedCalled(1));
    assertThat(matcher2, describeExpectedCalled(1));
    assertThat(matcher3, describeExpectedCalled(1));
  });

  it("describes actual by printing one values", () => {
    assertThat(contains(), matcherDescribesActualAs<Iterable<number>>(
      `[${EOL}` +
      `  1${EOL}` +
      `]`,
    ).given([1]));
  });

  it("describes actual by printing the values", () => {
    assertThat(contains(), matcherDescribesActualAs<Iterable<number>>(
      `[${EOL}` +
      `  1,${EOL}` +
      `  2,${EOL}` +
      `  3${EOL}` +
      `]`,
    ).given([1, 2, 3]));
  });

  it("describes any Iterable", () => {
    assertThat(contains(), matcherDescribesActualAs<Iterable<number>>(
      `[${EOL}` +
      `  1,${EOL}` +
      `  2,${EOL}` +
      `  3${EOL}` +
      `]`,
    ).given(new Set([1, 2, 3])));
  });
});
