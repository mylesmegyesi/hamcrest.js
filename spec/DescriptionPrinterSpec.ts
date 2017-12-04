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
      extraLines: [
        ["extra 1", "extra value 1"],
        ["extra 2", "extra value 2"],
      ],
    };

    const s = descriptionToString(description);

    const expected = `${EOL}` +
      `Expected: something${EOL}` +
      `     got: something else${EOL}` +
      ` extra 1: extra value 1${EOL}` +
      ` extra 2: extra value 2${EOL}`;

    assertThat(s, is(expected));
  });

  it("prints a description with the actual label longer that the expected label", () => {
    const description: Description = {
      expectedLabel: "Expected",
      expected: "something",
      actualLabel: "but got this thing",
      actual: "something else",
      extraLines: [],
    };

    const s = descriptionToString(description);

    const expected = `${EOL}` +
      `          Expected: something${EOL}` +
      `but got this thing: something else${EOL}`;

    assertThat(s, is(expected));
  });

  it("indents multi-line values separated with LF", () => {
    const description: Description = {
      expectedLabel: "Expected",
      expected: `{\n  "a": 1\n}`,
      actualLabel: "got",
      actual: `{\n  "a": 1,\n  "b": 2\n}`,
      extraLines: [],
    };

    const s = descriptionToString(description);

    const expected = `${EOL}` +
      `Expected: {${EOL}` +
      `            "a": 1${EOL}` +
      `          }${EOL}` +
      `     got: {${EOL}` +
      `            "a": 1,${EOL}` +
      `            "b": 2${EOL}` +
      `          }${EOL}`;

    assertThat(s, is(expected));
  });

  it("indents multi-line values separated with CRLF", () => {
    const description: Description = {
      expectedLabel: "Expected",
      expected: `{\r\n  "a": 1\r\n}`,
      actualLabel: "got",
      actual: `{\r\n  "a": 1,\r\n  "b": 2\r\n}`,
      extraLines: [],
    };

    const s = descriptionToString(description);

    const expected = `${EOL}` +
      `Expected: {${EOL}` +
      `            "a": 1${EOL}` +
      `          }${EOL}` +
      `     got: {${EOL}` +
      `            "a": 1,${EOL}` +
      `            "b": 2${EOL}` +
      `          }${EOL}`;

    assertThat(s, is(expected));
  });
});
