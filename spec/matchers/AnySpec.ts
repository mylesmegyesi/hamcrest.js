import { any } from "../../src";
import { assertTrue } from "../BootstrapAssertions";

describe("Any", () => {
  it("always matches", () => {
    const matcher = any();

    const matchResult = matcher.match(1);

    assertTrue(matchResult.matches);
  });
});
