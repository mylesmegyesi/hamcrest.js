import { Matcher } from "../Matcher";

import { allOf } from "./AllOf";
import { hasProperty } from "./HasProperty";

export type MatcherObject<T> = {
  [P in keyof T]: Matcher<T[P]>;
};

export function hasProperties<T>(expected: Partial<MatcherObject<T>>): Matcher<T> {
  const matchers: Matcher<T>[] = [];

  for (const key in expected) {
    if (expected.hasOwnProperty(key)) {
      matchers.push(hasProperty(key, expected[key]));
    }
  }

  return allOf(...matchers);
}
