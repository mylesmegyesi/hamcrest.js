export type MatchResult = MatchedMatchResult | FailedMatchResult;

export type MatchedMatchResult = Readonly<{
  matches: true;
  description: Description;
}>;

export type FailedMatchResult = Readonly<{
  matches: false;
  description: Description;
  diff?: Diff;
}>;

export type Description = Readonly<{
  expected: string;
  actual: string;
  extraLines: ReadonlyArray<DescriptionLine>;
}>;

export type DescriptionLine = Readonly<{
  label: string;
  value: string;
}>;

export type Diff = Readonly<{
  expected: any;
  actual: any;
}>;
