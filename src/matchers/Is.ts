import { Matcher } from "../Matcher";

import { equalTo, Show } from "./EqualTo";

export function is<T>(expected: T, toString?: Show<T>): Matcher<T> {
  return equalTo(expected, (e, a) => Object.is(e, a), toString);
}
