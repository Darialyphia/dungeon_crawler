import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { compilerOptions, transformAssetUrls } from "vue3-pixi";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions,
        transformAssetUrls,
      },
    }),

    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: ["vue", "@vueuse/core"],
    }),
  ],

  server: {
    port: 3001,
  },
});
