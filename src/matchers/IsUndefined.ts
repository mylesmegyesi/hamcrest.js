import isUndefined from "lodash.isundefined";

import { Matcher } from "../Matcher";

import { matches } from "./MatchesPredicate";

const isUndefinedMatcher = <T>(): Matcher<T | undefined, never> =>
  matches<undefined, T | undefined>(undefined, (_, actual) => isUndefined(actual));

export {
  isUndefinedMatcher as isUndefined,
};
