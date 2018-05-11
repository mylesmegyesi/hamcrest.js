import { EOL } from "os";

export type DescriptionLine = Readonly<{
  label: string;
  value: string;
}>;

const indent = (value: string, size: number): string => {
  const indentBuffer = " ".repeat(size);
  const lines = value.split(/\r?\n/);
  return lines.join(`${EOL}${indentBuffer}`);
};

const buildLines = (lines: DescriptionLine[]): string => {
  const longestLabel = Math.max(...lines.map(line => line.label.length));
  return EOL
    + lines
      .map(line => {
        const bufferSize = longestLabel - line.label.length;
        const buffer = " ".repeat(bufferSize);
        const label = `${buffer}${line.label}`;
        const separator = ": ";
        const indentSize = label.length + separator.length;
        const value = indent(line.value, indentSize);
        return `${label}${separator}${value}`;
      })
      .join(EOL)
    + EOL;
};

const ACTUAL = "got";
const EXPECTED = "Expected";

export class DescriptionBuilder {
  private readonly _extraLines: DescriptionLine[] = [];
  private readonly _expected: string;
  private readonly _actual: string;

  public constructor(expected: string, actual: string) {
    this._expected = expected;
    this._actual = actual;
  }

  public get extraLines(): ReadonlyArray<DescriptionLine> {
    return this._extraLines;
  }

  public addExtraLine(label: string, value: string): this {
    this._extraLines.push({
      label,
      value,
    });
    return this;
  }

  public build(): string {
    return buildLines([
      {
        label: EXPECTED,
        value: this._expected,
      },
      {
        label: ACTUAL,
        value: this._actual,
      },
      ...this._extraLines,
    ]);
  }
}
