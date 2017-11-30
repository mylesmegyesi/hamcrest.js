import { Matcher } from "../Matcher";

import { equalTo, Show } from "./EqualTo";

export function strictlyEqualTo<T>(expected: T, toString?: Show<T>): Matcher<T> {
  return equalTo(expected, (e, a) => e === a, toString);
}
