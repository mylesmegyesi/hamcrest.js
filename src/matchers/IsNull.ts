import isNull from "lodash.isnull";

import { Matcher } from "../Matcher";

import { matches } from "./MatchesPredicate";

const isNullMatcher = <T>(): Matcher<T | null, never> =>
  matches<null, T | null>(null, (_, actual) => isNull(actual));

export {
  isNullMatcher as isNull,
};
