import { EOL } from "os";

import { assertThat, Description, is } from "../src";
import { descriptionToString } from "../src/DescriptionPrinter";

describe("DescriptionPrinter", () => {
  it("prints a typical description", () => {
    const description: Description = {
      expectedLabel: "Expected",
      expected: "something",
      actualLabel: "got",
      actual: "something else",
    };

    const s = descriptionToString(description);

    const expected =
      `Expected: something${EOL}` +
      `     got: something else`;

    assertThat(s, is(expected));
  });

  it("prints a description with the actual label longer that the expected label", () => {
    const description: Description = {
      expectedLabel: "Expected",
      expected: "something",
      actualLabel: "but got this thing",
      actual: "something else",
    };

    const s = descriptionToString(description);

    const expected =
      `          Expected: something${EOL}` +
      `but got this thing: something else`;

    assertThat(s, is(expected));
  });
});
