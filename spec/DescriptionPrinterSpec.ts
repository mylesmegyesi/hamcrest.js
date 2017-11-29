import { EOL } from "os";

import { Description } from "../src";
import { descriptionToString } from "../src/DescriptionPrinter";

import { assertSame } from "./BootstrapAssertions";

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

    assertSame(expected, s);
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

    assertSame(expected, s);
  });
});
