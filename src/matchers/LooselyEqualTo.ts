import { Matcher } from "../Matcher";
import { Show } from "../ValueToString";

import { equalTo } from "./EqualTo";

export function looselyEqualTo<T>(expected: T, toString?: Show<T>): Matcher<T> {
  // tslint:disable-next-line triple-equals //
  return equalTo(expected, (e, a) => e == a, toString);
}
