import { DescriptionBuilder } from "../../DescriptionBuilder";
import { Matcher } from "../../Matcher";
import { MatchResult } from "../../MatchResult";
import { printValue } from "../../Printing";

function quote(s: string): string {
  return `"${s}"`;
}

function spaceInFront(s: string): string {
  return ` ${s}`;
}

function formatKeyArray(keys: string[]): string {
  const joined = keys.map(quote).map(spaceInFront).join(",");
  return `[${joined} ]`;
}

class HasExactlyTheseProperties<T, K extends keyof T> implements Matcher<T> {
  public constructor(private expectedKeys: K[]) {}

  public match(actual: T): MatchResult {
    const actualKeys: K[] = Object.keys(actual) as K[];

    const overlapKeys: K[] = [];
    const extraKeys: K[] = actualKeys.slice(0);
    const missingKeys: K[] = [];

    for (const expectedKey of this.expectedKeys) {
      let found = false;
      for (let i = 0; i < extraKeys.length; i++) {
        if (expectedKey === extraKeys[i]) {
          found = true;
          extraKeys.splice(i, 1);
          overlapKeys.push(expectedKey);
          break;
        }
      }
      if (!found) {
        missingKeys.push(expectedKey);
      }
    }

    const descriptionBuilder = DescriptionBuilder()
      .setExpected(this.describeExpected())
      .setActual(printValue(actual));

    if (missingKeys.length === 0 && extraKeys.length === 0) {
      return {
        matches: true,
        description: descriptionBuilder.build(),
      };
    }

    return {
      matches: false,
      description: descriptionBuilder
        .addLine("overlap", formatKeyArray(overlapKeys))
        .addLine("extra", formatKeyArray(extraKeys))
        .addLine("missing", formatKeyArray(missingKeys))
        .build(),
      diff: {
        expected: this.expectedKeys,
        actual: actualKeys,
      },
    };
  }

  private describeExpected(): string {
    const describedKeys = formatKeyArray(this.expectedKeys);
    return `an object with only these properties: ${describedKeys}`;
  }
}

export function hasExactlyTheseProperties<T, K extends keyof T>(...keys: K[]): Matcher<T> {
  return new HasExactlyTheseProperties(Array.from(new Set(keys)));
}
