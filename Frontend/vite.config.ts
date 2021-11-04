import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), glsl()],
  server: {
    port: 8080,
  },
  resolve: {
    alias: [
      {
        find: "@/",
        replacement: `${path.resolve(__dirname, "./src")}/`,
      },
    ],
  },
  build: {
    chunkSizeWarningLimit: 600,
    cssCodeSplit: false,
  },
});
