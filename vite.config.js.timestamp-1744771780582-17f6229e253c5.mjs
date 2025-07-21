// vite.config.js
import { defineConfig, loadEnv } from "file:///D:/code/zxzy-template-plus/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/code/zxzy-template-plus/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import Compression from "file:///D:/code/zxzy-template-plus/node_modules/vite-plugin-compression/dist/index.mjs";
import Components from "file:///D:/code/zxzy-template-plus/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///D:/code/zxzy-template-plus/node_modules/unplugin-vue-components/dist/resolvers.js";
import { EleAdminResolver } from "file:///D:/code/zxzy-template-plus/node_modules/@hnjing/zxzy-admin-plus/es/utils/resolvers.js";
import VueDevTools from "file:///D:/code/zxzy-template-plus/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
var vite_config_default = defineConfig(({ command, mode }) => {
  const isBuild = command === "build";
  const env = loadEnv(mode, process.cwd());
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
    plugins.push(VueDevTools());
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
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_APP_PORT),
      open: true,
      // 运行是否自动打开浏览器
      proxy: {
        // 反向代理解决跨域
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_BASE_API_URL,
          // 线上接口地址
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp("^" + env.VITE_APP_BASE_API), "")
          // 替换 /dev-api 为 target 接口地址
        },
        // [env.VITE_APP_ADMIN_BASE_API]: {
        //   target: env.VITE_APP_ADMIN_BASE_API_URL,
        //   changeOrigin: true,
        //   rewrite: path =>
        //     path.replace(new RegExp("^" + env.VITE_APP_ADMIN_BASE_API), "") // 文件分片微服务
        // },
        [env.VITE_APP_BUSINESS_BASE_API]: {
          target: env.VITE_APP_BUSINESS_BASE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp("^" + env.VITE_APP_BUSINESS_BASE_API), "")
          // 文件分片微服务
        },
        warmup: {
          clientFiles: ["./index.html", "./src/{views,components}/*"]
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
      chunkSizeWarningLimit: 2e3,
      terserOptions: command === "build" ? {
        // 仅在构建时生效
        compress: {
          drop_console: true,
          // 移除console
          drop_debugger: true
          // 移除debugger
        }
      } : {}
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjb2RlXFxcXHp4enktdGVtcGxhdGUtcGx1c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcY29kZVxcXFx6eHp5LXRlbXBsYXRlLXBsdXNcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2NvZGUvenh6eS10ZW1wbGF0ZS1wbHVzL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgQ29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJztcbmltcG9ydCB7IEVsZUFkbWluUmVzb2x2ZXIgfSBmcm9tICdAaG5qaW5nL3p4enktYWRtaW4tcGx1cy9lcy91dGlscy9yZXNvbHZlcnMnO1xuaW1wb3J0IFZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pID0+IHtcbiAgY29uc3QgaXNCdWlsZCA9IGNvbW1hbmQgPT09ICdidWlsZCc7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSk7XG4gIGNvbnN0IGFsaWFzID0ge1xuICAgICdALyc6IHJlc29sdmUoJ3NyYycpICsgJy8nLFxuICAgICd2dWUtaTE4bic6ICd2dWUtaTE4bi9kaXN0L3Z1ZS1pMThuLmNqcy5qcydcbiAgfTtcbiAgY29uc3QgcGx1Z2lucyA9IFt2dWUoKV07XG4gIGlmIChpc0J1aWxkKSB7XG4gICAgLy8gXHU3RUM0XHU0RUY2XHU2MzA5XHU5NzAwXHU1RjE1XHU1MTY1XG4gICAgcGx1Z2lucy5wdXNoKFxuICAgICAgQ29tcG9uZW50cyh7XG4gICAgICAgIGR0czogZmFsc2UsXG4gICAgICAgIHJlc29sdmVyczogW1xuICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoe1xuICAgICAgICAgICAgaW1wb3J0U3R5bGU6ICdzYXNzJ1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIEVsZUFkbWluUmVzb2x2ZXIoe1xuICAgICAgICAgICAgaW1wb3J0U3R5bGU6ICdzYXNzJ1xuICAgICAgICAgIH0pXG4gICAgICAgIF1cbiAgICAgIH0pXG4gICAgKTtcbiAgICAvLyBnemlwXHU1MzhCXHU3RjI5XG4gICAgcGx1Z2lucy5wdXNoKFxuICAgICAgQ29tcHJlc3Npb24oe1xuICAgICAgICBkaXNhYmxlOiAhaXNCdWlsZCxcbiAgICAgICAgdGhyZXNob2xkOiAxMDI0MCxcbiAgICAgICAgYWxnb3JpdGhtOiAnZ3ppcCcsXG4gICAgICAgIGV4dDogJy5neidcbiAgICAgIH0pXG4gICAgKTtcbiAgICBhbGlhc1snLi9hcy1uZWVkZWQnXSA9ICcuL2dsb2JhbC1pbXBvcnQnO1xuICB9IGVsc2Uge1xuICAgIC8vIFx1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1x1NTE2OFx1NUM0MFx1NUI4OVx1ODhDNVxuICAgIHBsdWdpbnMucHVzaChWdWVEZXZUb29scygpKTtcbiAgICBhbGlhc1snLi9hcy1uZWVkZWQnXSA9ICcuL2dsb2JhbC1pbXBvcnQnO1xuICB9XG4gIHJldHVybiB7XG4gICAgcmVzb2x2ZTogeyBhbGlhcyB9LFxuICAgIHBsdWdpbnMsXG4gICAgY3NzOiB7XG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEB1c2UgXCJAL3N0eWxlcy92YXJpYWJsZXMuc2Nzc1wiIGFzICo7YFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICAgIHBvcnQ6IE51bWJlcihlbnYuVklURV9BUFBfUE9SVCksXG4gICAgICBvcGVuOiB0cnVlLCAvLyBcdThGRDBcdTg4NENcdTY2MkZcdTU0MjZcdTgxRUFcdTUyQThcdTYyNTNcdTVGMDBcdTZENEZcdTg5QzhcdTU2NjhcbiAgICAgIHByb3h5OiB7XG4gICAgICAgIC8vIFx1NTNDRFx1NTQxMVx1NEVFM1x1NzQwNlx1ODlFM1x1NTFCM1x1OERFOFx1NTdERlxuICAgICAgICBbZW52LlZJVEVfQVBQX0JBU0VfQVBJXToge1xuICAgICAgICAgIHRhcmdldDogZW52LlZJVEVfQVBQX0JBU0VfQVBJX1VSTCwgLy8gXHU3RUJGXHU0RTBBXHU2M0E1XHU1M0UzXHU1NzMwXHU1NzQwXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PlxuICAgICAgICAgICAgcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoJ14nICsgZW52LlZJVEVfQVBQX0JBU0VfQVBJKSwgJycpIC8vIFx1NjZGRlx1NjM2MiAvZGV2LWFwaSBcdTRFM0EgdGFyZ2V0IFx1NjNBNVx1NTNFM1x1NTczMFx1NTc0MFxuICAgICAgICB9LFxuICAgICAgICAvLyBbZW52LlZJVEVfQVBQX0FETUlOX0JBU0VfQVBJXToge1xuICAgICAgICAvLyAgIHRhcmdldDogZW52LlZJVEVfQVBQX0FETUlOX0JBU0VfQVBJX1VSTCxcbiAgICAgICAgLy8gICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIC8vICAgcmV3cml0ZTogcGF0aCA9PlxuICAgICAgICAvLyAgICAgcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoXCJeXCIgKyBlbnYuVklURV9BUFBfQURNSU5fQkFTRV9BUEkpLCBcIlwiKSAvLyBcdTY1ODdcdTRFRjZcdTUyMDZcdTcyNDdcdTVGQUVcdTY3MERcdTUyQTFcbiAgICAgICAgLy8gfSxcbiAgICAgICAgW2Vudi5WSVRFX0FQUF9CVVNJTkVTU19CQVNFX0FQSV06IHtcbiAgICAgICAgICB0YXJnZXQ6IGVudi5WSVRFX0FQUF9CVVNJTkVTU19CQVNFX0FQSV9VUkwsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PlxuICAgICAgICAgICAgcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoJ14nICsgZW52LlZJVEVfQVBQX0JVU0lORVNTX0JBU0VfQVBJKSwgJycpIC8vIFx1NjU4N1x1NEVGNlx1NTIwNlx1NzI0N1x1NUZBRVx1NjcwRFx1NTJBMVxuICAgICAgICB9LFxuICAgICAgICB3YXJtdXA6IHtcbiAgICAgICAgICBjbGllbnRGaWxlczogWycuL2luZGV4Lmh0bWwnLCAnLi9zcmMve3ZpZXdzLGNvbXBvbmVudHN9LyonXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgJ2VjaGFydHMvY29yZScsXG4gICAgICAgICdlY2hhcnRzL2NoYXJ0cycsXG4gICAgICAgICdlY2hhcnRzL3JlbmRlcmVycycsXG4gICAgICAgICdlY2hhcnRzL2NvbXBvbmVudHMnLFxuICAgICAgICAndnVlLWVjaGFydHMnLFxuICAgICAgICAnZWNoYXJ0cy13b3JkY2xvdWQnLFxuICAgICAgICAnc29ydGFibGVqcycsXG4gICAgICAgICd2dWVkcmFnZ2FibGUnXG4gICAgICBdXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgdGFyZ2V0OiAnY2hyb21lNjMnLFxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyMDAwLFxuICAgICAgdGVyc2VyT3B0aW9uczpcbiAgICAgICAgY29tbWFuZCA9PT0gJ2J1aWxkJ1xuICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAvLyBcdTRFQzVcdTU3MjhcdTY3ODRcdTVFRkFcdTY1RjZcdTc1MUZcdTY1NDhcbiAgICAgICAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsIC8vIFx1NzlGQlx1OTY2NGNvbnNvbGVcbiAgICAgICAgICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlIC8vIFx1NzlGQlx1OTY2NGRlYnVnZ2VyXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICA6IHt9XG4gICAgfVxuICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNRLFNBQVMsY0FBYyxlQUFlO0FBQzVTLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFDcEMsU0FBUyx3QkFBd0I7QUFDakMsT0FBTyxpQkFBaUI7QUFFeEIsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxTQUFTLEtBQUssTUFBTTtBQUNqRCxRQUFNLFVBQVUsWUFBWTtBQUM1QixRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxDQUFDO0FBQ3ZDLFFBQU0sUUFBUTtBQUFBLElBQ1osTUFBTSxRQUFRLEtBQUssSUFBSTtBQUFBLElBQ3ZCLFlBQVk7QUFBQSxFQUNkO0FBQ0EsUUFBTSxVQUFVLENBQUMsSUFBSSxDQUFDO0FBQ3RCLE1BQUksU0FBUztBQUVYLFlBQVE7QUFBQSxNQUNOLFdBQVc7QUFBQSxRQUNULEtBQUs7QUFBQSxRQUNMLFdBQVc7QUFBQSxVQUNULG9CQUFvQjtBQUFBLFlBQ2xCLGFBQWE7QUFBQSxVQUNmLENBQUM7QUFBQSxVQUNELGlCQUFpQjtBQUFBLFlBQ2YsYUFBYTtBQUFBLFVBQ2YsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGLENBQUM7QUFBQSxJQUNIO0FBRUEsWUFBUTtBQUFBLE1BQ04sWUFBWTtBQUFBLFFBQ1YsU0FBUyxDQUFDO0FBQUEsUUFDVixXQUFXO0FBQUEsUUFDWCxXQUFXO0FBQUEsUUFDWCxLQUFLO0FBQUEsTUFDUCxDQUFDO0FBQUEsSUFDSDtBQUNBLFVBQU0sYUFBYSxJQUFJO0FBQUEsRUFDekIsT0FBTztBQUVMLFlBQVEsS0FBSyxZQUFZLENBQUM7QUFDMUIsVUFBTSxhQUFhLElBQUk7QUFBQSxFQUN6QjtBQUNBLFNBQU87QUFBQSxJQUNMLFNBQVMsRUFBRSxNQUFNO0FBQUEsSUFDakI7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILHFCQUFxQjtBQUFBLFFBQ25CLE1BQU07QUFBQSxVQUNKLGdCQUFnQjtBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU0sT0FBTyxJQUFJLGFBQWE7QUFBQSxNQUM5QixNQUFNO0FBQUE7QUFBQSxNQUNOLE9BQU87QUFBQTtBQUFBLFFBRUwsQ0FBQyxJQUFJLGlCQUFpQixHQUFHO0FBQUEsVUFDdkIsUUFBUSxJQUFJO0FBQUE7QUFBQSxVQUNaLGNBQWM7QUFBQSxVQUNkLFNBQVMsQ0FBQyxTQUNSLEtBQUssUUFBUSxJQUFJLE9BQU8sTUFBTSxJQUFJLGlCQUFpQixHQUFHLEVBQUU7QUFBQTtBQUFBLFFBQzVEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFPQSxDQUFDLElBQUksMEJBQTBCLEdBQUc7QUFBQSxVQUNoQyxRQUFRLElBQUk7QUFBQSxVQUNaLGNBQWM7QUFBQSxVQUNkLFNBQVMsQ0FBQyxTQUNSLEtBQUssUUFBUSxJQUFJLE9BQU8sTUFBTSxJQUFJLDBCQUEwQixHQUFHLEVBQUU7QUFBQTtBQUFBLFFBQ3JFO0FBQUEsUUFDQSxRQUFRO0FBQUEsVUFDTixhQUFhLENBQUMsZ0JBQWdCLDRCQUE0QjtBQUFBLFFBQzVEO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUix1QkFBdUI7QUFBQSxNQUN2QixlQUNFLFlBQVksVUFDUjtBQUFBO0FBQUEsUUFFRSxVQUFVO0FBQUEsVUFDUixjQUFjO0FBQUE7QUFBQSxVQUNkLGVBQWU7QUFBQTtBQUFBLFFBQ2pCO0FBQUEsTUFDRixJQUNBLENBQUM7QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
