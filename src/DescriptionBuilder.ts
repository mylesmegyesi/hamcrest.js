import { Description, DescriptionLine } from "./MatchResult";

export class DescriptionBuilder {
  private static defaultExpectedLabel: string = "Expected";

  private actual: string = "";
  private actualLabel: string = "got";
  private expected: string = "";
  private expectedLabel: string = DescriptionBuilder.defaultExpectedLabel;
  private extraLines: DescriptionLine[] = [];

  public constructor(description?: Description) {
    if (description) {
      this.actual = description.actual;
      this.actualLabel = description.actualLabel;
      this.expected = description.expected;
      this.expectedLabel = description.expectedLabel;
      this.extraLines = description.extraLines.slice(0);
    }
  }

  public resetExpectedLabelToDefault(): this {
    this.expectedLabel = DescriptionBuilder.defaultExpectedLabel;
    return this;
  }

  public setExpected(s: string): this {
    this.expected = s;
    return this;
  }

  public prependToExpected(s: string): this {
    this.expected = `${s}${this.expected}`;
    return this;
  }

  public appendToExpected(s: string): this {
    this.expected = `${this.expected}${s}`;
    return this;
  }

  public setActualLabel(s: string): this {
    this.actualLabel = s;
    return this;
  }

  public setActual(s: string): this {
    this.actual = s;
    return this;
  }

  public prependToActual(s: string): this {
    this.actual = `${s}${this.actual}`;
    return this;
  }

  public appendToActual(s: string): this {
    this.actual = `${this.actual}${s}`;
    return this;
  }

  public addLine(label: string, value: string): this {
    this.extraLines.push({ label, value });
    return this;
  }

  public build(): Description {
    return {
      expectedLabel: this.expectedLabel,
      expected: this.expected,
      actualLabel: this.actualLabel,
      actual: this.actual,
      extraLines: this.extraLines,
    };
  }
}
