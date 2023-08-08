import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { compilerOptions, transformAssetUrls } from "vue3-pixi";
import AutoImport from "unplugin-auto-import/vite";
import { comlink } from "vite-plugin-comlink";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions,
        transformAssetUrls,
      },
    }),

    comlink(),

    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: ["vue", "@vueuse/core"],
    }),
  ],

  worker: {
    plugins: [comlink()],
  },

  server: {
    port: 3001,
  },
});
