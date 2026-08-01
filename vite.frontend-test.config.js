import { defineConfig } from "vite";
import baseConfig from "./vite.config.js";
import { fileURLToPath } from "node:url";

export default defineConfig((configEnv) => {
  const resolvedBaseConfig = typeof baseConfig === "function" ? baseConfig(configEnv) : baseConfig;

  return {
    ...resolvedBaseConfig,
    build: {
      outDir: "dist-frontend-test",
      emptyOutDir: true,
      rollupOptions: {
        input: fileURLToPath(new URL("./frontend-test.html", import.meta.url)),
      },
    },
  };
});
