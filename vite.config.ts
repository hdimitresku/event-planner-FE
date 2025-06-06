import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 5432,
    },
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
      "import.meta.env.VITE_API_IMAGE_URL": JSON.stringify(env.VITE_API_IMAGE_URL),
      "import.meta.env.VITE_APP_ENV": JSON.stringify(env.VITE_APP_ENV),
      "import.meta.env.VITE_APP_NAME": JSON.stringify(env.VITE_APP_NAME),
    },
  };
});