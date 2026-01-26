import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path/win32";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: path.resolve(__dirname, "app/setupTests.ts"),
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname),
      // se usar src:
      // "@": path.resolve(__dirname, "src"),
    },
  },
});
