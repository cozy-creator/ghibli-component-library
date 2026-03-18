import { defineConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default defineConfig({
  ...viteConfig,
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["src/test/**/*.test.ts", "src/test/**/*.test.tsx"],
    pool: "forks",
    setupFiles: ["./src/test/setup.ts"]
  }
});
