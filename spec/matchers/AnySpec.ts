import { any } from "../../src";
import { assertSame } from "../BootstrapAssertions";

describe("Any", () => {
  it("always matches", () => {
    const matcher = any();

    const matchResult = matcher.match(1);

    assertSame(true, matchResult.matches);
  });
});
