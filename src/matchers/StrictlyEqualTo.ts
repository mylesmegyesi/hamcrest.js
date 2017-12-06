import { Matcher } from "../Matcher";
import { Show, valueToString } from "../ValueToString";

import { equalTo } from "./EqualTo";

export function strictlyEqualTo<T>(expected: T, toString: Show<T> = valueToString): Matcher<T> {
  return equalTo<T, T>(expected, (e, a) => e === a, toString, toString);
}
