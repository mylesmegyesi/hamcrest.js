import { Matcher } from "../Matcher";

import { matches } from "./MatchesPredicate";

export const strictlyEqualTo = <T>(expected: T): Matcher<T, never> => (
  matches<T, T>(expected, (e, a) => e === a)
);
