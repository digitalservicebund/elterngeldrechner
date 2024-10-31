// Writing custom rules in typescript requires either using ts-node as the
// execution engine or maintaining rules in their own typescript project.

// To align with the company value of #focusonimpact, I've decided to keep
// things simple for now and write the rule in javaScript. If we accumulate
// more rules over time, we may want to reconsider this decision.

import viMockImportsRule from "./vi-mock-imports.js";

const plugin = {
  meta: {
    name: "egr-rules",
  },
  rules: {
    "vi-mock-imports": viMockImportsRule,
  },
};

export default plugin;
