import { defineConfig } from "vite";
import baseConfig from "./vite.config.js";
import { fileURLToPath } from "node:url";

export default defineConfig({
  ...baseConfig,
  build: {
    outDir: "dist-frontend-test",
    emptyOutDir: true,
    rollupOptions: {
      input: fileURLToPath(new URL("./frontend-test.html", import.meta.url)),
    },
  },
});
