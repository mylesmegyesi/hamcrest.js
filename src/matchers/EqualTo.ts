import isEqual from "lodash.isequal";

import { Matcher } from "../Matcher";

import { matches } from "./MatchesPredicate";

export const equalTo = <T>(expected: T): Matcher<T, never> =>
  matches<T, T>(expected, isEqual);
