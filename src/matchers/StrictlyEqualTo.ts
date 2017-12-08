import { Matcher } from "../Matcher";

import { equalTo } from "./EqualTo";

export function strictlyEqualTo<T>(expected: T): Matcher<T> {
  return equalTo<T, T>(expected, (e, a) => e === a);
}
