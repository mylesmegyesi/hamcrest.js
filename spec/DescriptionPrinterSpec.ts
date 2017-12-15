import { EOL } from "os";

import { assertThat, Description, is } from "../src";
import { descriptionToString } from "../src/DescriptionPrinter";

describe("DescriptionPrinter", () => {
  it("prints a typical description", () => {
    const description: Description = {
      expected: "something",
      actual: "something else",
      extraLines: [
        {
          label: "extra 1",
          value: "extra value 1",
        },
        {
          label: "extra 2",
          value: "extra value 2",
        },
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

  it("indents multi-line values separated with LF", () => {
    const description: Description = {
      expected: `{\n  "a": 1\n}`,
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
      expected: `{\r\n  "a": 1\r\n}`,
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
