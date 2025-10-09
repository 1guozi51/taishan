import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: "buffer", // VERY IMPORTANT
      "@": path.resolve("./src"),
    },
  },
  optimizeDeps: {
    include: ["buffer"], // Force buffer to be pre-bundled
  },
  server: {
    host: true, // 允许局域网访问
    port: 3333,
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});
