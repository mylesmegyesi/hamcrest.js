import { EOL } from "os";

import { Description, DescriptionLine } from "./MatchResult";

function indent(value: string, size: number): string {
  const indentBuffer = " ".repeat(size);
  const lines = value.split(/\r?\n/);
  return lines.join(`${EOL}${indentBuffer}`);
}

function buildLines(lines: DescriptionLine[]): string {
  const longestLabel = Math.max(...lines.map(line => line.label.length));
  return EOL + lines.map(line => {
    const bufferSize = longestLabel - line.label.length;
    const buffer = " ".repeat(bufferSize);
    const label = `${buffer}${line.label}`;
    const separator = `: `;
    const indentSize = label.length + separator.length;
    const value = indent(line.value, indentSize);
    return `${label}${separator}${value}`;
  }).join(EOL) + EOL;
}

const ACTUAL: string = "got";
const EXPECTED: string = "Expected";

export function descriptionToString(description: Description): string {
  return buildLines([
    {
      label: EXPECTED,
      value: description.expected,
    },
    {
      label: ACTUAL,
      value: description.actual,
    },
    ...description.extraLines,
  ]);
}
