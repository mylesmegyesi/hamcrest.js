import { EOL } from "os";

import isEqual = require("lodash.isequal");

import { AssertionError } from "../src";

export function assertSame<T>(expected: T, actual: T): void {
  if (actual !== expected) {
    throw new Error(
      `Expected: ${JSON.stringify(expected, null, 2)}${EOL}` +
      `     got: ${JSON.stringify(actual, null, 2)}`,
    );
  }
}

export function assertEqual<T>(expected: T, actual: T): void {
  if (!isEqual(expected, actual)) {
    throw new Error(
      `Expected: ${JSON.stringify(expected, null, 2)}${EOL}` +
      `     got: ${JSON.stringify(actual, null, 2)}`,
    );
  }
}

export function assertFalse(actual: boolean): void {
  assertSame(false, actual);
}

export function assertThrows(f: () => void, matcher: (e: AssertionError) => void): void {
  let thrownError: AssertionError | null = null;
  try {
    f();
  } catch (e) {
    if (!(e instanceof AssertionError)) {
      throw e;
    }

    thrownError = e;
  }

  if (!thrownError) {
    throw new Error("did not throw");
  }

  matcher(thrownError);
}
