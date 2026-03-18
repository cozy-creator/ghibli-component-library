import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

import { baseConfig } from "./base.mjs";

export default [
  ...baseConfig,
  reactHooks.configs.flat["recommended-latest"],
  reactRefresh.configs.vite,
  {
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        {
          "allowConstantExport": true
        }
      ]
    }
  }
];
