import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        react: path.resolve("./node_modules/react"),
        "react-dom": path.resolve("./node_modules/react-dom"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.DEBUG_TARGET,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
