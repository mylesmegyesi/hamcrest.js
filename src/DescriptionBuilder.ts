import { Description } from "./MatchResult";

export class DescriptionBuilder {
  private actual: string = "";
  private actualLabel: string = "got";
  private expected: string = "";
  private expectedLabel: string = "Expected";
  public appendToExpected(s: string): this {
    this.expected += s;
    return this;
  }

  public setActualLabel(s: string): this {
    this.actualLabel = s;
    return this;
  }

  public appendToActual(s: string): this {
    this.actual += s;
    return this;
  }

  public build(): Description {
    return {
      expectedLabel: this.expectedLabel,
      expected: this.expected,
      actualLabel: this.actualLabel,
      actual: this.actual,
    };
  }
}
