import isEqual = require("lodash.isequal");

import { Matcher } from "../Matcher";

import { matches } from "./MatchesPredicate";

export function equalTo<T>(expected: T): Matcher<T, never> {
  return matches<T, T>(expected, isEqual);
}
