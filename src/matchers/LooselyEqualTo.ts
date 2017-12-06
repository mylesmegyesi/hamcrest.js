import { Matcher } from "../Matcher";
import { Show } from "../ValueToString";

import { equalTo } from "./EqualTo";

export function looselyEqualTo<E, A>(expected: E, expectedToString?: Show<E>, actualToString?: Show<A>): Matcher<A> {
  // tslint:disable-next-line triple-equals //
  return equalTo(expected, (e: any, a: any) => e == a, expectedToString, actualToString);
}
