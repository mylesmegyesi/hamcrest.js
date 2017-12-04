import { Matcher } from "../../Matcher";
import { allOf } from "../AllOf";

import { hasProperty } from "./HasProperty";
import { MatcherObject } from "./MatcherObject";

export function hasProperties<T>(expected: Partial<MatcherObject<T>>): Matcher<T> {
  const matchers: Matcher<T>[] = [];

  for (const key in expected) {
    if (expected.hasOwnProperty(key)) {
      matchers.push(hasProperty(key, expected[key]));
    }
  }

  return allOf(...matchers);
}
