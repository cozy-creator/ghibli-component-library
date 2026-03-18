import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@/components/blocks": fileURLToPath(new URL("../../registry/ghibli/blocks", import.meta.url)),
      "@/components/ui": fileURLToPath(new URL("../../registry/ghibli/ui", import.meta.url)),
      "@/lib": fileURLToPath(new URL("../../registry/ghibli/lib", import.meta.url)),
      "@": fileURLToPath(new URL("../../", import.meta.url))
    }
  }
});
