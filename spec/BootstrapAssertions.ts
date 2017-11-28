import { EOL } from "os";

import { AssertionError } from "../src";

export function assertSame<T>(expected: T, actual: T): void {
  if (actual !== expected) {
    throw new Error(
      `Expected: ${JSON.stringify(expected)}${EOL}` +
      `     got: ${JSON.stringify(actual)}`,
    );
  }
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
