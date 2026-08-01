import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";
import tailwindcss from "@tailwindcss/vite";

const getAliasPath = (path) => {
  return fileURLToPath(new URL(path, import.meta.url));
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": getAliasPath("./src"),
      "@assets": getAliasPath("./src/assets"),
      "@components": getAliasPath("./src/components"),
      "@pages": getAliasPath("./src/pages"),
      "@hooks": getAliasPath("./src/hooks"),
      "@apis": getAliasPath("./src/apis"),
    },
  },
});
