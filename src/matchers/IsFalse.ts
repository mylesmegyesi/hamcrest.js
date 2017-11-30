import { Matcher } from "../Matcher";

import { strictlyEqualTo } from "./StrictlyEqualTo";

export function isFalse(): Matcher<boolean> {
  return strictlyEqualTo(false);
}
