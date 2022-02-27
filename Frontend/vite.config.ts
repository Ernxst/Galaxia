import vue from "@vitejs/plugin-vue";
import { createHtmlPlugin as minifyHtml } from "vite-plugin-html";
import path from "path";
import { defineConfig } from "vite";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    minifyHtml({
      minify: true,
    }),],
  server: {
    port: 8000,
    host: true,
  },
  resolve: {
    alias: [
      {
        find: "@/",
        replacement: `${path.resolve(__dirname, "./src")}/`,
      },
    ],
  },
  esbuild: {
    minify: true,
    treeShaking: true,
  },
  build: {
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    emptyOutDir: true,
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      manualChunks: {
        lodash: ['lodash']
      }
    }
  },

});
