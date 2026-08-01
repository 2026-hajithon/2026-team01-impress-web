import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";
import { networkInterfaces } from "node:os";
import process from "node:process";
import tailwindcss from "@tailwindcss/vite";

const getAliasPath = (path) => {
  return fileURLToPath(new URL(path, import.meta.url));
};

const getLocalNetworkHost = () => {
  const interfaces = networkInterfaces();
  const interfaceNames = ["en0", "en1", ...Object.keys(interfaces)];

  for (const interfaceName of interfaceNames) {
    const address = interfaces[interfaceName]?.find(
      (entry) => entry.family === "IPv4" && !entry.internal,
    );

    if (address) return address.address;
  }

  return "";
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const localNetworkHost = env.VITE_DEV_LAN_HOST || getLocalNetworkHost();

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: "0.0.0.0",
    },
    define: {
      "import.meta.env.VITE_DEV_LAN_HOST": JSON.stringify(localNetworkHost),
    },
    resolve: {
      alias: {
        "@": getAliasPath("./src"),
        "@assets": getAliasPath("./src/assets"),
        "@components": getAliasPath("./src/components"),
        "@pages": getAliasPath("./src/pages"),
        "@hooks": getAliasPath("./src/hooks"),
        "@apis": getAliasPath("./src/apis"),
        "@utils": getAliasPath("./src/utils"),
      },
    },
  };
});
