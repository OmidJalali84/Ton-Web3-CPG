import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
  },
  // Removed the 'define' section for Buffer because
  // its value must be a valid JSON literal.
  optimizeDeps: {
    esbuildOptions: {
      // Map Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  resolve: {
    alias: {
      // Ensure that the 'buffer' package is used
      buffer: "buffer",
    },
  },
});
