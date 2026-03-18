import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest"],
  viteFinal(baseConfig) {
    return mergeConfig(baseConfig, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          "@/components/blocks": fileURLToPath(new URL("../../../registry/ghibli/blocks", import.meta.url)),
          "@/components/ui": fileURLToPath(new URL("../../../registry/ghibli/ui", import.meta.url)),
          "@/lib": fileURLToPath(new URL("../../../registry/ghibli/lib", import.meta.url)),
          "@": fileURLToPath(new URL("../../../", import.meta.url))
        }
      }
    });
  }
};

export default config;
