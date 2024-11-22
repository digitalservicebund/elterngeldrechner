// Writing custom rules in typescript requires either using ts-node as the
// execution engine or maintaining rules in their own typescript project.

// To align with the company value of #focusonimpact, I've decided to keep
// things simple for now and write the rule in javaScript. If we accumulate
// more rules over time, we may want to reconsider this decision.

import viImportRule from "./rules/vi-import.js";
import leakingDevDependenciesRule from "./rules/leaking-dev-dependencies.js";

const plugin = {
  rules: {
    "vi-import": viImportRule,
    "leaking-dev-dependencies": leakingDevDependenciesRule,
  },
};

export default plugin;
