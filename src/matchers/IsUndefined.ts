import valueIsUndefined = require("lodash.isundefined");

import { Matcher } from "../Matcher";

import { matches } from "./MatchesPredicate";

export function isUndefined<T>(): Matcher<T | undefined> {
  return matches(undefined, (_, actual) => valueIsUndefined(actual));
}
