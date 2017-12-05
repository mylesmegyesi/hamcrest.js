import { Matcher } from "../Matcher";
import { Show } from "../ValueToString";

import { equalTo } from "./EqualTo";

export function is<T>(expected: T, toString?: Show<T>): Matcher<T> {
  return equalTo(expected, (e, a) => Object.is(e, a), toString);
}
