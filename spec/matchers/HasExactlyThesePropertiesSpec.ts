import { assertThat, DescriptionBuilder, hasExactlyTheseProperties, matcherDoesNotMatch, matcherMatches } from "../../src";
import { assertEqual } from "../BootstrapAssertions";

describe("HasExactlyTheseProperties", () => {
  it("matches if the object only has the given properties", () => {
    const actual = {
      a: 1,
      b: 2,
    };

    const hasOnlyThesePropertiesMatcher = hasExactlyTheseProperties<typeof actual, "a" | "b">("a", "b");

    assertThat(hasOnlyThesePropertiesMatcher.match(actual), matcherMatches());
  });

  it("fails with multiple extra and missing and overlap properties", () => {
    const actual = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    };

    const hasOnlyThesePropertiesMatcher = hasExactlyTheseProperties<{[key: string]: any}, string>("c", "d", "e", "f");

    const result = hasOnlyThesePropertiesMatcher.match(actual);

    assertThat(result, matcherDoesNotMatch());

    assertEqual(result, {
      matches: false,
      description: new DescriptionBuilder()
        .setExpected(`an object with only these properties: [ "c", "d", "e", "f" ]`)
        .setActual(JSON.stringify(actual, null, 2))
        .addLine("overlap", `[ "c", "d" ]`)
        .addLine("extra", `[ "a", "b" ]`)
        .addLine("missing", `[ "e", "f" ]`)
        .build(),
      diff: {
        expected: ["c", "d", "e", "f"],
        actual: ["a", "b", "c", "d"],
      },
    });
  });

  it("ignores duplicate expected keys", () => {
    const actual = {
      a: 1,
    };

    const hasOnlyThesePropertiesMatcher = hasExactlyTheseProperties<{[key: string]: any}, string>("a", "b", "a");

    const result = hasOnlyThesePropertiesMatcher.match(actual);

    assertThat(result, matcherDoesNotMatch());

    assertEqual(result, {
      matches: false,
      description: new DescriptionBuilder()
        .setExpected(`an object with only these properties: [ "a", "b" ]`)
        .setActual(JSON.stringify(actual, null, 2))
        .addLine("overlap", `[ "a" ]`)
        .addLine("extra", `[ ]`)
        .addLine("missing", `[ "b" ]`)
        .build(),
      diff: {
        expected: ["a", "b"],
        actual: ["a"],
      },
    });
  });
});
