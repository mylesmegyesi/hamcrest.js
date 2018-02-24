import { Matcher } from "../Matcher";

import { matches } from "./MatchesPredicate";

export function is<T>(expected: T): Matcher<T, never> {
  return matches<T, T>(expected, (e, a) => Object.is(e, a));
}
