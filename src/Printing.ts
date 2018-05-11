import isBoolean from "lodash.isboolean";
import isNull from "lodash.isnull";
import isNumber from "lodash.isnumber";
import isPlainObject from "lodash.isplainobject";
import isString from "lodash.isstring";
import isUndefined from "lodash.isundefined";
import toString from "lodash.tostring";
import { EOL } from "os";

const INDENT_SIZE = 2;
const MAX_SINGLE_LINE_LENGTH = 80;
const MULTILINE_ITEM_SEPARATOR = `,${EOL}`;
const NEWLINE_REGEX: RegExp = /\r?\n/;
const SINGLE_LINE_ITEM_SEPARATOR = ", ";

const LEFT_BRACKET = "[";
const RIGHT_BRACKET = "]";

const LEFT_BRACE = "{";
const RIGHT_BRACE = "}";

export const isMultiLine = (s: string): boolean => NEWLINE_REGEX.test(s);

const indent = (s: string, n: number): string => {
  const indentBuffer = " ".repeat(n);
  return s.split(NEWLINE_REGEX)
    .map(line => `${indentBuffer}${line}`)
    .join(EOL);
};

export type Print<T> = (value: T) => string;

const formatSingleLineEntity = (left: string, printedItems: string[], right: string): string =>
  `${left} ${printedItems.join(SINGLE_LINE_ITEM_SEPARATOR)} ${right}`;

const formatMultiLineEntity = (left: string, printedItems: string[], right: string): string => {
  const printedLines = printedItems
    .map(i => indent(i, INDENT_SIZE))
    .join(MULTILINE_ITEM_SEPARATOR);

  return `${left}${EOL}${printedLines}${EOL}${right}`;
};

const formatArraySingleLine = (printedItems: string[]): string => formatSingleLineEntity(LEFT_BRACKET, printedItems, RIGHT_BRACKET);
const formatArrayMultipleLines = (printedItems: string[]): string => formatMultiLineEntity(LEFT_BRACKET, printedItems, RIGHT_BRACKET);

export const printArray = <T>(items: Iterable<T>, printItem: Print<T>, forceMultiLine = false): string => {
  const printedItems: string[] = [];

  for (const item of items) {
    printedItems.push(printItem(item));
  }

  if (forceMultiLine || printedItems.some(isMultiLine)) {
    return formatArrayMultipleLines(printedItems);
  } else {
    const singleLineArray = formatArraySingleLine(printedItems);
    if (singleLineArray.length > MAX_SINGLE_LINE_LENGTH) {
      return formatArrayMultipleLines(printedItems);
    }

    return singleLineArray;
  }
};

const formatObjectSingleLine = (printedItems: string[]): string => formatSingleLineEntity(LEFT_BRACE, printedItems, RIGHT_BRACE);
const formatObjectMultipleLines = (printedItems: string[]): string => formatMultiLineEntity(LEFT_BRACE, printedItems, RIGHT_BRACE);

export type ObjectPrinters<T> = {
  [P in keyof T]: Print<T[P]>
};

export const printObjectItems = <T>(obj: T, printers: ObjectPrinters<T>): string[] => {
  const lines: string[] = [];

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    const print = printers[key];

    lines.push(`${key}: ${print(obj[key])}`);
  }

  return lines;
};

export const printObject = <T>(obj: T, printers: ObjectPrinters<T>, forceMultiLine = false): string => {
  const printedItems: string[] = printObjectItems(obj, printers);

  if (forceMultiLine || printedItems.length > 1 || printedItems.some(isMultiLine)) {
    return formatObjectMultipleLines(printedItems);
  } else {
    const singleLineObject = formatObjectSingleLine(printedItems);

    if (singleLineObject.length > MAX_SINGLE_LINE_LENGTH) {
      return formatObjectMultipleLines(printedItems);
    }

    return singleLineObject;
  }
};

const buildObjectPrinters = <T>(printer: Print<any>): ObjectPrinters<T> =>
  new Proxy({}, { get: (): Print<any> => printer }) as ObjectPrinters<T>;

export const printBoolean: Print<boolean> = toString;
export const printNull: Print<null> = (): string => "null";
export const printUndefined: Print<undefined> = (): string => "undefined";
export const printNumber: Print<number> = toString;
export const printString: Print<string> = (value): string => JSON.stringify(value);
export const maybeUndefinedPrinter = <T>(print: Print<T>): Print<T | undefined> => (value: T | undefined): string => isUndefined(value) ? printUndefined(value) : print(value);
export const maybeNullPrinter = <T>(print: Print<T>): Print<T | null> => (value: T | null): string => isNull(value) ? printNull(value) : print(value);
export const maybeNullOrUndefinedPrinter = <T>(print: Print<T>): Print<T | null | undefined> => maybeNullPrinter(maybeUndefinedPrinter(print));
export const arrayPrinter = <T>(printItem: Print<T>): Print<T[]> => (items: T[]): string => printArray(items, printItem);
export const objectPrinter = <T>(printers: ObjectPrinters<T>): Print<T> => (item: T): string => printObject(item, printers);

export const printValue = (value: any): string => {
  if (isBoolean(value)) {
    return printBoolean(value);
  }

  if (isNull(value)) {
    return printNull(value);
  }

  if (isUndefined(value)) {
    return printUndefined(value);
  }

  if (isNumber(value)) {
    return printNumber(value);
  }

  if (isString(value)) {
    return printString(value);
  }

  if (Array.isArray(value)) {
    return printArray(value, printValue);
  }

  if (isPlainObject(value)) {
    return printObject(value, buildObjectPrinters(printValue));
  }

  return toString(value);
};
