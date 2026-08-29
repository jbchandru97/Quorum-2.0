import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // The cloned Malbank / Aql AI host app. Vendored from
    // jbchandru97/mal-ai and deliberately kept as-is so its
    // interactions and visual behaviour match the original — the
    // only edits are the import and route rewrites needed to run it
    // under /demo. Linting it would produce findings we must not act
    // on, and would bury findings in Quorum's own code.
    "src/app/demo/**",
    "src/components/demo/**",
  ]),
]);

export default eslintConfig;
