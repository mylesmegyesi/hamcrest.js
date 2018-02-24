import { Matcher } from "../Matcher";

import { matches } from "./MatchesPredicate";

export function strictlyEqualTo<T>(expected: T): Matcher<T, never> {
  return matches<T, T>(expected, (e, a) => e === a);
}
