import { UserConfig, RuleConfigSeverity } from "@commitlint/types";

export default {
  extends: "@commitlint/config-conventional",
  rules: {
    "body-case": [RuleConfigSeverity.Error, "always", "sentence-case"],
  },
} satisfies UserConfig;
