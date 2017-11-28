import { EOL } from "os";

import { Description } from "./MatchResult";

type Line = [string, string];

function buildLines(lines: Line[]): string {
  const longestLabel = Math.max(...lines.map((line: string[]): number => line[0].length));
  return lines.map(line => {
    const count = longestLabel - line[0].length;
    const buffer = " ".repeat(count);
    return `${buffer}${line[0]}: ${line[1]}`;
  }).join(EOL);
}

export function descriptionToString(description: Description): string {
  return buildLines([
    [description.expectedLabel, description.expected],
    [description.actualLabel, description.actual],
  ]);
}
