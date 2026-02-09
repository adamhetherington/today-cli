const js = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
  js.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2022, sourceType: "module" },
      globals: { require: "readonly", module: "readonly", process: "readonly", console: "readonly", __dirname: "readonly", __filename: "readonly", Buffer: "readonly", setTimeout: "readonly", clearTimeout: "readonly" },
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", "**/*.test.ts", "*.cjs"],
  },
];
