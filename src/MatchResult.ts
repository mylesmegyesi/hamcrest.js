export type MatchResult = MatchedMatchResult | FailedMatchResult;

export type MatchedMatchResult = Readonly<{
  matches: true;
}>;

export type FailedMatchResult = Readonly<{
  matches: false;
  description: Description;
  diff?: Diff;
}>;

export type Description = Readonly<{
  expectedLabel: string;
  expected: string;
  actualLabel: string;
  actual: string;
}>;

export type Diff = Readonly<{
  expected: any;
  actual: any;
}>;