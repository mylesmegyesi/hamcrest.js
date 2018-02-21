import { EOL } from "os";

import { assertThat, DescriptionBuilder, is } from "../src";

describe("DescriptionPrinter", () => {
  it("prints a typical description", () => {
    const description = new DescriptionBuilder("something", "something else")
      .addExtraLine("extra 1", "extra value 1")
      .addExtraLine("extra 2", "extra value 2")
      .build();

    assertThat(description, is(
      `${EOL}` +
      `Expected: something${EOL}` +
      `     got: something else${EOL}` +
      ` extra 1: extra value 1${EOL}` +
      ` extra 2: extra value 2${EOL}`,
    ));
  });

  it("indents multi-line values separated with LF", () => {
    const description = new DescriptionBuilder(`{\n  "a": 1\n}`, `{\n  "a": 1,\n  "b": 2\n}`).build();

    assertThat(description, is(
      `${EOL}` +
      `Expected: {${EOL}` +
      `            "a": 1${EOL}` +
      `          }${EOL}` +
      `     got: {${EOL}` +
      `            "a": 1,${EOL}` +
      `            "b": 2${EOL}` +
      `          }${EOL}`,
    ));
  });

  it("indents multi-line values separated with CRLF", () => {
    const description = new DescriptionBuilder(`{\r\n  "a": 1\r\n}`, `{\r\n  "a": 1,\r\n  "b": 2\r\n}`).build();

    assertThat(description, is(
      `${EOL}` +
      `Expected: {${EOL}` +
      `            "a": 1${EOL}` +
      `          }${EOL}` +
      `     got: {${EOL}` +
      `            "a": 1,${EOL}` +
      `            "b": 2${EOL}` +
      `          }${EOL}`,
    ));
  });
});
