export type MatchResult<T = any> = Readonly<{
  matches: boolean;
  data?: T;
  diff?: Diff;
}>;

export type Diff = Readonly<{
  expected: any;
  actual: any;
}>;
