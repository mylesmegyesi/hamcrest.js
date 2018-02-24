import { Matcher } from "../Matcher";

export type ObjectMatchers<T> = {
  [P in keyof T]: Matcher<T[P], any>;
};
