import { ESLintUtils } from "@typescript-eslint/utils";

const rule = ESLintUtils.RuleCreator.withoutDocs({
  name: "vi-mock-imports",
  meta: {
    type: "problem",
    messages: {
      unexpectedMock:
        'Use import(...) instead of a string for vi.mock: "{{ mockParam }}".',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const isMatchingFunctionCall =
          node.callee.type === "MemberExpression" &&
          node.callee.object.name === "vi" &&
          node.callee.property.name === "mock";

        if (isMatchingFunctionCall) {
          const args = node.arguments;

          if (args.length > 0) {
            const firstArg = args[0];

            const isForbiddenStringImport =
              firstArg.type === "Literal" && typeof firstArg.value === "string";

            if (isForbiddenStringImport) {
              const importPath = firstArg.value;

              // Check if the import path starts with "@" to ignore mocking
              // of external modules like react-redux etc.
              if (importPath.startsWith("@")) {
                context.report({
                  node: firstArg,
                  messageId: "unexpectedMock",
                  data: {
                    mockParam: importPath,
                  },
                });
              }
            }
          }
        }
      },
    };
  },
});

export default rule;
