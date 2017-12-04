import { EOL } from "os";

import { Description, DescriptionLine } from "./MatchResult";

function indent(value: string, size: number): string {
  const indentBuffer = " ".repeat(size);
  const lines = value.split(/\r?\n/);
  return lines.join(`${EOL}${indentBuffer}`);
}

function buildLines(lines: DescriptionLine[]): string {
  const longestLabel = Math.max(...lines.map(line => line[0].length));
  return EOL + lines.map(line => {
    const bufferSize = longestLabel - line[0].length;
    const buffer = " ".repeat(bufferSize);
    const label = `${buffer}${line[0]}`;
    const separator = `: `;
    const indentSize = label.length + separator.length;
    const value = indent(line[1], indentSize);
    return `${label}${separator}${value}`;
  }).join(EOL) + EOL;
}

export function descriptionToString(description: Description): string {
  return buildLines([
    [description.expectedLabel, description.expected],
    [description.actualLabel, description.actual],
    ...description.extraLines,
  ]);
}
