import type { UserConfig } from "@commitlint/types";
import { RuleConfigSeverity } from "@commitlint/types";

export default {
  extends: "@commitlint/config-conventional",
  rules: {
    "body-case": [RuleConfigSeverity.Error, "always", "sentence-case"],
    "header-max-length": [RuleConfigSeverity.Error, "always", 72],
    "body-max-line-length": [RuleConfigSeverity.Error, "always", 72],
  },
} satisfies UserConfig;
