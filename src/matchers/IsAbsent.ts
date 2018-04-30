import { Matcher } from "../Matcher";

import { anyOf } from "./AnyOf";
import { isNull } from "./IsNull";
import { isUndefined } from "./IsUndefined";

export const isAbsent = <T>(): Matcher<T | null | undefined, never> => anyOf<T>(isNull<T>(), isUndefined<T>());
