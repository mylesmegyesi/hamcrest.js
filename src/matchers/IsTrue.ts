import { Matcher } from "../Matcher";

import { strictlyEqualTo } from "./StrictlyEqualTo";

export const isTrue = (): Matcher<boolean, never> => strictlyEqualTo<boolean>(true);
