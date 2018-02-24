import { Matcher } from "../Matcher";

import { strictlyEqualTo } from "./StrictlyEqualTo";

export function isFalse(): Matcher<boolean, never> {
  return strictlyEqualTo(false);
}
