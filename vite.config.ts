import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "core/index.ts"),
      name: "talmíd-mitmaréd-redis",
      fileName: "talmíd-mitmaréd-redis",
    },
  },
  plugins: [dts()],
});
