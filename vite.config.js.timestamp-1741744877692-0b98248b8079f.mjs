// vite.config.js
import { defineConfig } from "file:///D:/code/zxzy/zxzy-code-statistics/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/code/zxzy/zxzy-code-statistics/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import Compression from "file:///D:/code/zxzy/zxzy-code-statistics/node_modules/vite-plugin-compression/dist/index.mjs";
import Components from "file:///D:/code/zxzy/zxzy-code-statistics/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///D:/code/zxzy/zxzy-code-statistics/node_modules/unplugin-vue-components/dist/resolvers.js";
import { EleAdminResolver } from "file:///D:/code/zxzy/zxzy-code-statistics/node_modules/@hnjing/zxzy-admin-plus/es/utils/resolvers.js";
var vite_config_default = defineConfig(({ command }) => {
  const isBuild = command === "build";
  const alias = {
    "@/": resolve("src") + "/",
    "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
  };
  const plugins = [vue()];
  if (isBuild) {
    plugins.push(
      Components({
        dts: false,
        resolvers: [
          ElementPlusResolver({
            importStyle: "sass"
          }),
          EleAdminResolver({
            importStyle: "sass"
          })
        ]
      })
    );
    plugins.push(
      Compression({
        disable: !isBuild,
        threshold: 10240,
        algorithm: "gzip",
        ext: ".gz"
      })
    );
    alias["./as-needed"] = "./global-import";
  } else {
    alias["./as-needed"] = "./global-import";
  }
  return {
    resolve: { alias },
    plugins,
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;`
        }
      }
    },
    optimizeDeps: {
      include: [
        "echarts/core",
        "echarts/charts",
        "echarts/renderers",
        "echarts/components",
        "vue-echarts",
        "echarts-wordcloud",
        "sortablejs",
        "vuedraggable"
      ]
    },
    build: {
      target: "chrome63",
      chunkSizeWarningLimit: 2e3
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjb2RlXFxcXHp4enlcXFxcenh6eS1jb2RlLXN0YXRpc3RpY3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGNvZGVcXFxcenh6eVxcXFx6eHp5LWNvZGUtc3RhdGlzdGljc1xcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovY29kZS96eHp5L3p4enktY29kZS1zdGF0aXN0aWNzL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgQ29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJztcbmltcG9ydCB7IEVsZUFkbWluUmVzb2x2ZXIgfSBmcm9tICdAaG5qaW5nL3p4enktYWRtaW4tcGx1cy9lcy91dGlscy9yZXNvbHZlcnMnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCB9KSA9PiB7XG4gIGNvbnN0IGlzQnVpbGQgPSBjb21tYW5kID09PSAnYnVpbGQnO1xuICBjb25zdCBhbGlhcyA9IHtcbiAgICAnQC8nOiByZXNvbHZlKCdzcmMnKSArICcvJyxcbiAgICAndnVlLWkxOG4nOiAndnVlLWkxOG4vZGlzdC92dWUtaTE4bi5janMuanMnXG4gIH07XG4gIGNvbnN0IHBsdWdpbnMgPSBbdnVlKCldO1xuICBpZiAoaXNCdWlsZCkge1xuICAgIC8vIFx1N0VDNFx1NEVGNlx1NjMwOVx1OTcwMFx1NUYxNVx1NTE2NVxuICAgIHBsdWdpbnMucHVzaChcbiAgICAgIENvbXBvbmVudHMoe1xuICAgICAgICBkdHM6IGZhbHNlLFxuICAgICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKHtcbiAgICAgICAgICAgIGltcG9ydFN0eWxlOiAnc2FzcydcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBFbGVBZG1pblJlc29sdmVyKHtcbiAgICAgICAgICAgIGltcG9ydFN0eWxlOiAnc2FzcydcbiAgICAgICAgICB9KVxuICAgICAgICBdXG4gICAgICB9KVxuICAgICk7XG4gICAgLy8gZ3ppcFx1NTM4Qlx1N0YyOVxuICAgIHBsdWdpbnMucHVzaChcbiAgICAgIENvbXByZXNzaW9uKHtcbiAgICAgICAgZGlzYWJsZTogIWlzQnVpbGQsXG4gICAgICAgIHRocmVzaG9sZDogMTAyNDAsXG4gICAgICAgIGFsZ29yaXRobTogJ2d6aXAnLFxuICAgICAgICBleHQ6ICcuZ3onXG4gICAgICB9KVxuICAgICk7XG4gICAgYWxpYXNbJy4vYXMtbmVlZGVkJ10gPSAnLi9nbG9iYWwtaW1wb3J0JztcbiAgfSBlbHNlIHtcbiAgICAvLyBcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTUxNjhcdTVDNDBcdTVCODlcdTg4QzVcbiAgICBhbGlhc1snLi9hcy1uZWVkZWQnXSA9ICcuL2dsb2JhbC1pbXBvcnQnO1xuICB9XG4gIHJldHVybiB7XG4gICAgcmVzb2x2ZTogeyBhbGlhcyB9LFxuICAgIHBsdWdpbnMsXG4gICAgY3NzOiB7XG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEB1c2UgXCJAL3N0eWxlcy92YXJpYWJsZXMuc2Nzc1wiIGFzICo7YFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgJ2VjaGFydHMvY29yZScsXG4gICAgICAgICdlY2hhcnRzL2NoYXJ0cycsXG4gICAgICAgICdlY2hhcnRzL3JlbmRlcmVycycsXG4gICAgICAgICdlY2hhcnRzL2NvbXBvbmVudHMnLFxuICAgICAgICAndnVlLWVjaGFydHMnLFxuICAgICAgICAnZWNoYXJ0cy13b3JkY2xvdWQnLFxuICAgICAgICAnc29ydGFibGVqcycsXG4gICAgICAgICd2dWVkcmFnZ2FibGUnXG4gICAgICBdXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgdGFyZ2V0OiAnY2hyb21lNjMnLFxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyMDAwXG4gICAgfVxuICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZSLFNBQVMsb0JBQW9CO0FBQzFULE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFDcEMsU0FBUyx3QkFBd0I7QUFFakMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxRQUFRLE1BQU07QUFDM0MsUUFBTSxVQUFVLFlBQVk7QUFDNUIsUUFBTSxRQUFRO0FBQUEsSUFDWixNQUFNLFFBQVEsS0FBSyxJQUFJO0FBQUEsSUFDdkIsWUFBWTtBQUFBLEVBQ2Q7QUFDQSxRQUFNLFVBQVUsQ0FBQyxJQUFJLENBQUM7QUFDdEIsTUFBSSxTQUFTO0FBRVgsWUFBUTtBQUFBLE1BQ04sV0FBVztBQUFBLFFBQ1QsS0FBSztBQUFBLFFBQ0wsV0FBVztBQUFBLFVBQ1Qsb0JBQW9CO0FBQUEsWUFDbEIsYUFBYTtBQUFBLFVBQ2YsQ0FBQztBQUFBLFVBQ0QsaUJBQWlCO0FBQUEsWUFDZixhQUFhO0FBQUEsVUFDZixDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0g7QUFFQSxZQUFRO0FBQUEsTUFDTixZQUFZO0FBQUEsUUFDVixTQUFTLENBQUM7QUFBQSxRQUNWLFdBQVc7QUFBQSxRQUNYLFdBQVc7QUFBQSxRQUNYLEtBQUs7QUFBQSxNQUNQLENBQUM7QUFBQSxJQUNIO0FBQ0EsVUFBTSxhQUFhLElBQUk7QUFBQSxFQUN6QixPQUFPO0FBRUwsVUFBTSxhQUFhLElBQUk7QUFBQSxFQUN6QjtBQUNBLFNBQU87QUFBQSxJQUNMLFNBQVMsRUFBRSxNQUFNO0FBQUEsSUFDakI7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILHFCQUFxQjtBQUFBLFFBQ25CLE1BQU07QUFBQSxVQUNKLGdCQUFnQjtBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUix1QkFBdUI7QUFBQSxJQUN6QjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
