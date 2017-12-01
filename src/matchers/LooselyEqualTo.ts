import { Matcher } from "../Matcher";

import { equalTo, Show } from "./EqualTo";

export function looselyEqualTo<T>(expected: T, toString?: Show<T>): Matcher<T> {
  // tslint:disable-next-line triple-equals //
  return equalTo(expected, (e, a) => e == a, toString);
}
