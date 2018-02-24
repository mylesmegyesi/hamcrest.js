import { Matcher } from "../Matcher";

import { strictlyEqualTo } from "./StrictlyEqualTo";

export function isTrue(): Matcher<boolean, never> {
  return strictlyEqualTo(true);
}
