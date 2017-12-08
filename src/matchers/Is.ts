import { Matcher } from "../Matcher";

import { equalTo } from "./EqualTo";

export function is<T>(expected: T): Matcher<T> {
  return equalTo<T, T>(expected, (e, a) => Object.is(e, a));
}
