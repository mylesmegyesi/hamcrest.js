import { Matcher } from "../Matcher";

import { matches } from "./MatchesPredicate";

export const is = <T>(expected: T): Matcher<T, never> =>
  matches<T, T>(expected, (e, a) => Object.is(e, a));
