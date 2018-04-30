import { Matcher } from "../Matcher";

import { matches } from "./MatchesPredicate";

export const looselyEqualTo = <E, A>(expected: E): Matcher<A, never> =>
  // tslint:disable-next-line triple-equals
  matches<E, A>(expected, (e: any, a: any) => e == a);
