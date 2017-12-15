import { Description, DescriptionLine } from "./MatchResult";

export class Buildable {
  public constructor(private expected: string,
                     private actual: string,
                     private extraLines: ReadonlyArray<DescriptionLine>) {}

  public setExpected(expected: string): Buildable {
    this.expected = expected;
    return this;
  }

  public setActual(actual: string): Buildable {
    this.actual = actual;
    return this;
  }

  public addLine(label: string, value: string): this {
    this.extraLines = this.extraLines.concat([{ label, value }]);
    return this;
  }

  public build(): Description {
    return {
      expected: this.expected,
      actual: this.actual,
      extraLines: this.extraLines,
    };
  }
}

export class WithOnlyExpected {
  public constructor(private expected: string,
                     private extraLines: ReadonlyArray<DescriptionLine>) {}

  public setExpected(expected: string): WithOnlyExpected {
    this.expected = expected;
    return this;
  }

  public setActual(actual: string): Buildable {
    return new Buildable(this.expected, actual, this.extraLines);
  }

  public addLine(label: string, value: string): this {
    this.extraLines = this.extraLines.concat([{ label, value }]);
    return this;
  }
}

export class WithOnlyActual {
  public constructor(private actual: string,
                     private extraLines: ReadonlyArray<DescriptionLine>) {}

  public setExpected(expected: string): Buildable {
    return new Buildable(expected, this.actual, this.extraLines);
  }

  public setActual(actual: string): WithOnlyActual {
    this.actual = actual;
    return this;
  }

  public addLine(label: string, value: string): this {
    this.extraLines = this.extraLines.concat([{ label, value }]);
    return this;
  }
}

export class Empty {
  private extraLines: ReadonlyArray<DescriptionLine> = [];

  public setExpected(expected: string): WithOnlyExpected {
    return new WithOnlyExpected(expected, this.extraLines);
  }

  public setActual(actual: string): WithOnlyActual {
    return new WithOnlyActual(actual, this.extraLines);
  }

  public addLine(label: string, value: string): this {
    this.extraLines = this.extraLines.concat([{ label, value }]);
    return this;
  }
}

export function DescriptionBuilder(): Empty {
  return new Empty();
}
