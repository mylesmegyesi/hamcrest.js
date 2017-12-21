import { Matcher } from "../Matcher";

import { anyOf } from "./AnyOf";
import { isNull } from "./IsNull";
import { isUndefined } from "./IsUndefined";

export function isAbsent<T>(): Matcher<T | null | undefined> {
  return anyOf(isNull(), isUndefined());
}
