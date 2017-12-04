import { Matcher } from "../../Matcher";
import { allOf } from "../AllOf";

import { hasExactlyTheseProperties } from "./HasExactlyTheseProperties";
import { hasProperties } from "./HasProperties";
import { MatcherObject } from "./MatcherObject";

export function matchesObject<T, K extends keyof T>(expected: MatcherObject<T>): Matcher<T> {
  return allOf(
    hasExactlyTheseProperties(...Object.keys(expected) as K[]),
    hasProperties(expected),
  );
}
