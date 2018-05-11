import { Matcher } from "../Matcher";

import { strictlyEqualTo } from "./StrictlyEqualTo";

export const isFalse = (): Matcher<boolean, never> => strictlyEqualTo<boolean>(false);
