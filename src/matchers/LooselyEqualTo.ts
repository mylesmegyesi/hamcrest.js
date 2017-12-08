import { Matcher } from "../Matcher";

import { matches } from "./MatchesPredicate";

export function looselyEqualTo<E, A>(expected: E): Matcher<A> {
  // tslint:disable-next-line triple-equals //
  return matches<E, A>(expected, (e: any, a: any) => e == a);
}
