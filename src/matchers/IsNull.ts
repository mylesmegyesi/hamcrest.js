import valueIsNull = require("lodash.isnull");

import { Matcher } from "../Matcher";

import { matches } from "./MatchesPredicate";

export function isNull<T>(): Matcher<T | null, never> {
  return matches(null, (_, actual) => valueIsNull(actual));
}
