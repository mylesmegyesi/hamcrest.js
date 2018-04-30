import { EOL } from "os";

import {
  arrayPrinter,
  assertThat,
  is,
  maybeNullOrUndefinedPrinter,
  maybeNullPrinter,
  maybeUndefinedPrinter,
  objectPrinter,
  Print,
  printBoolean,
  printNull,
  printNumber,
  printString,
  printUndefined,
  printValue,
} from "../src";

describe("Printing", () => {
  it("true", () => {
    assertThat(printBoolean(true), is("true"));
    assertThat(printValue(true), is("true"));
  });

  it("false", () => {
    assertThat(printBoolean(false), is("false"));
    assertThat(printValue(false), is("false"));
  });

  it("null", () => {
    assertThat(printNull(null), is("null"));
    assertThat(printValue(null), is("null"));
  });

  it("undefined", () => {
    assertThat(printUndefined(undefined), is("undefined"));
    assertThat(printValue(undefined), is("undefined"));
  });

  it("maybe undefined", () => {
    const printer = maybeUndefinedPrinter(printBoolean);
    assertThat(printer(undefined), is("undefined"));
    assertThat(printer(true), is("true"));
  });

  it("maybe null", () => {
    const printer = maybeNullPrinter(printBoolean);
    assertThat(printer(null), is("null"));
    assertThat(printer(true), is("true"));
  });

  it("maybe null or undefined", () => {
    const printer = maybeNullOrUndefinedPrinter(printBoolean);
    assertThat(printer(null), is("null"));
    assertThat(printer(undefined), is("undefined"));
    assertThat(printer(true), is("true"));
  });

  it("positive integer", () => {
    assertThat(printNumber(10), is("10"));
    assertThat(printValue(10), is("10"));
  });

  it("negative integer", () => {
    assertThat(printNumber(-10), is("-10"));
    assertThat(printValue(-10), is("-10"));
  });

  it("positive zero", () => {
    assertThat(printNumber(+0), is("0"));
    assertThat(printValue(+0), is("0"));
  });

  it("negative zero", () => {
    assertThat(printNumber(-0), is("-0"));
    assertThat(printValue(-0), is("-0"));
  });

  it("positive decimal", () => {
    assertThat(printNumber(10.12345), is("10.12345"));
    assertThat(printValue(10.12345), is("10.12345"));
  });

  it("negative decimal", () => {
    assertThat(printNumber(-10.12345), is("-10.12345"));
    assertThat(printValue(-10.12345), is("-10.12345"));
  });

  it("string", () => {
    assertThat(printString("a string"), is("\"a string\""));
    assertThat(printValue("a string"), is("\"a string\""));
    assertThat(printString("\"quoted\""), is("\"\\\"quoted\\\"\""));
    assertThat(printString("with\nlf"), is("\"with\\nlf\""));
    assertThat(printString("with\r\ncrlf"), is("\"with\\r\\ncrlf\""));
  });

  it("array with single item", () => {
    assertThat(arrayPrinter(printNumber)([1]), is("[ 1 ]"));
    assertThat(printValue([1]), is("[ 1 ]"));
  });

  it("array with two items", () => {
    assertThat(arrayPrinter(printNumber)([1, 2]), is("[ 1, 2 ]"));
    assertThat(printValue([1, 2]), is("[ 1, 2 ]"));
  });

  it("array prints on multiple lines if any value exceeds 80 characters", () => {
    const a: string = "a".repeat(81);
    const b: string = "b".repeat(81);
    assertThat(arrayPrinter(printString)([a, b]), is(`[${EOL}  "${a}",${EOL}  "${b}"${EOL}]`));
    assertThat(printValue([a, b]), is(`[${EOL}  "${a}",${EOL}  "${b}"${EOL}]`));
  });

  it("array prints on multiple lines if any value is multi-line", () => {
    type Multiple = {
      a: number;
      b: number;
    };
    const printMultiple: Print<Multiple> = objectPrinter<Multiple>({
      a: printNumber,
      b: printNumber,
    });
    const value: Multiple[] = [{ a: 1, b: 2 }];
    const expected = `[${EOL}  {${EOL}    a: 1,${EOL}    b: 2${EOL}  }${EOL}]`;
    assertThat(arrayPrinter(printMultiple)(value), is(expected));
    assertThat(printValue(value), is(expected));
  });

  it("object with one item", () => {
    type Single = {
      a: number;
    };
    const printSingle: Print<Single> = objectPrinter<Single>({
      a: printNumber,
    });
    assertThat(printSingle({ a: 2 }), is("{ a: 2 }"));
    assertThat(printValue({ a: 2 }), is("{ a: 2 }"));
  });

  it("object prints on multiple lines if there is only one item but it exceeds 80 characters", () => {
    type Single = {
      a: string;
    };
    const printSingle: Print<Single> = objectPrinter<Single>({
      a: printString,
    });
    const a = "a".repeat(81);
    const value = { a };
    const expected = `{${EOL}  a: "${a}"${EOL}}`;
    assertThat(printSingle(value), is(expected));
    assertThat(printValue(value), is(expected));
  });

  it("object prints on multiple lines if there is only one item but it is multi-line", () => {
    type O = {
      a: {
        b: number;
        c: number;
      };
    };
    const printSingle: Print<O> = objectPrinter<O>({
      a: objectPrinter({
        b: printNumber,
        c: printNumber,
      }),
    });
    const value: O = { a: { b: 1, c: 2 } };
    const expected = `{${EOL}  a: {${EOL}    b: 1,${EOL}    c: 2${EOL}  }${EOL}}`;
    assertThat(printSingle(value), is(expected));
    assertThat(printValue(value), is(expected));
  });

  it("object prints on multiple lines when there is more than one item", () => {
    type Multiple = {
      a: number;
      b: string;
      c: boolean;
      d?: number;
    };
    const printMultiple: Print<Multiple> = objectPrinter<Multiple>({
      a: printNumber,
      b: printString,
      c: printBoolean,
      d: maybeUndefinedPrinter(printNumber),
    });
    const value1 = { a: 2, b: "foo", c: true };
    const expected1 = `{${EOL}  a: 2,${EOL}  b: "foo",${EOL}  c: true${EOL}}`;
    const value2 = { a: 2, b: "foo", c: true, d: 1 };
    const expected2 = `{${EOL}  a: 2,${EOL}  b: "foo",${EOL}  c: true,${EOL}  d: 1${EOL}}`;
    assertThat(printMultiple(value1), is(expected1));
    assertThat(printMultiple(value2), is(expected2));
    assertThat(printValue(value1), is(expected1));
    assertThat(printValue(value2), is(expected2));
  });

  it("prints non-plain objects", () => {
    class Something {
    }

    assertThat(printValue(new Something()), is("[object Object]"));
  });

  it("prints non-plain objects that implement toString", () => {
    class Something {
      private readonly _a: number;

      public constructor(a: number) {
        this._a = a;
      }

      public toString(): string {
        return `Something (${this._a})`;
      }
    }

    assertThat(printValue(new Something(1)), is("Something (1)"));
  });
});
