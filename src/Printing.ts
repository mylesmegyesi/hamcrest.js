import isBoolean = require("lodash.isboolean");
import isNull = require("lodash.isnull");
import isNumber = require("lodash.isnumber");
import isPlainObject = require("lodash.isplainobject");
import isString = require("lodash.isstring");
import isUndefined = require("lodash.isundefined");
import toString = require("lodash.tostring");
import { EOL } from "os";

const MULTILINE_ITEM_SEPARATOR = `,${EOL}`;
const NEWLINE_REGEX: RegExp = /\r?\n/;
const SINGLELINE_ITEM_SEPARATOR = ", ";

const LEFT_BRACKET = "[";
const RIGHT_BRACKET = "]";

const LEFT_BRACE = "{";
const RIGHT_BRACE = "}";

export function isMultiLine(s: string): boolean {
  return NEWLINE_REGEX.test(s);
}

export function indent(s: string, n: number): string {
  const indentBuffer = " ".repeat(n);
  return s.split(NEWLINE_REGEX)
    .map(line => `${indentBuffer}${line}`)
    .join(EOL);
}

export type Print<T> = (value: T) => string;

function formatSingleLineEntity(left: string, printedItems: string[], right: string): string {
  return `${left} ${printedItems.join(SINGLELINE_ITEM_SEPARATOR)} ${right}`;
}

function formatMultiLineEntity(left: string, printedItems: string[], right: string): string {
  const printedLines = printedItems
    .map(i => indent(i, 2))
    .join(MULTILINE_ITEM_SEPARATOR);

  return `${left}${EOL}${printedLines}${EOL}${right}`;
}

function formatArraySingleLine(printedItems: string[]): string {
  return formatSingleLineEntity(LEFT_BRACKET, printedItems, RIGHT_BRACKET);
}

function formatArrayMultipleLines(printedItems: string[]): string {
  return formatMultiLineEntity(LEFT_BRACKET, printedItems, RIGHT_BRACKET);
}

export function printArray<T>(items: T[], printItem: Print<T>): string {
  const printedItems = items.map(printItem);
  const anyMultiLineItems = printedItems.some(isMultiLine);

  if (anyMultiLineItems) {
    return formatArrayMultipleLines(printedItems);
  } else {
    const singleLineArray = formatArraySingleLine(printedItems);
    if (singleLineArray.length > 80) {
      return formatArrayMultipleLines(printedItems);
    }

    return singleLineArray;
  }
}

function formatObjectSingleLine(printedItems: string[]): string {
  return formatSingleLineEntity(LEFT_BRACE, printedItems, RIGHT_BRACE);
}

function formatObjectMultipleLines(printedItems: string[]): string {
  return formatMultiLineEntity(LEFT_BRACE, printedItems, RIGHT_BRACE);
}

export type ObjectPrinters<T> = {
  [P in keyof T]: Print<T[P]>
};

export function printObjectItems<T>(obj: T, printers: ObjectPrinters<T>): string[] {
  const lines: string[] = [];

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    const print = printers[key];

    lines.push(`${key}: ${print(obj[key])}`);
  }

  return lines;
}

export function printObject<T>(obj: T, printers: ObjectPrinters<T>): string {
  const printedItems: string[] = printObjectItems(obj, printers);

  if (printedItems.length > 1 || printedItems.some(isMultiLine)) {
    return formatObjectMultipleLines(printedItems);
  } else {
    const singleLineObject = formatObjectSingleLine(printedItems);
    if (singleLineObject.length > 80) {
      return formatObjectMultipleLines(printedItems);
    }

    return singleLineObject;
  }
}

function buildObjectPrinters<T>(printer: Print<any>, obj: T): ObjectPrinters<T> {
  const printers: Partial<ObjectPrinters<T>> = {};

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    printers[key] = printer;
  }

  return printers as ObjectPrinters<T>;
}

export const printBoolean: Print<boolean> = toString;
export const printNull: Print<null> = _ => "null";
export const printUndefined: Print<undefined> = _ => "undefined";
export const printNumber: Print<number> = toString;
export const printString: Print<string> = value => JSON.stringify(value);

export function maybeUndefinedPrinter<T>(print: Print<T>): Print<T | undefined> {
  return (value: T | undefined) => {
    if (isUndefined(value)) {
      return printUndefined(value);
    }

    return print(value);
  };
}

export function maybeNullPrinter<T>(print: Print<T>): Print<T | null> {
  return (value: T | null) => {
    if (isNull(value)) {
      return printNull(value);
    }

    return print(value);
  };
}

export function maybeNullOrUndefinedPrinter<T>(print: Print<T>): Print<T | null | undefined> {
  return maybeNullPrinter(maybeUndefinedPrinter(print));
}

export function arrayPrinter<T>(printItem: Print<T>): Print<T[]> {
  return (items: T[]) => {
    return printArray(items, printItem);
  };
}

export function objectPrinter<T>(printers: ObjectPrinters<T>): Print<T> {
  return (item: T) => {
    return printObject(item, printers);
  };
}

export function printValue(value: any): string {
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
    return printObject(value, buildObjectPrinters(printValue, value));
  }

  return toString(value);
}
