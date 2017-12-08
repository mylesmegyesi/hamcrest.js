import { Matcher } from "../Matcher";

import { equalTo } from "./EqualTo";

export function looselyEqualTo<E, A>(expected: E): Matcher<A> {
  // tslint:disable-next-line triple-equals //
  return equalTo(expected, (e: any, a: any) => e == a);
}
