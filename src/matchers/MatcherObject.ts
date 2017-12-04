import { Matcher } from "../Matcher";

export type MatcherObject<T> = {
  [P in keyof T]: Matcher<T[P]>;
};
