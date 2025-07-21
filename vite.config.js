import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import Compression from 'vite-plugin-compression';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { EleAdminResolver } from '@hnjing/zxzy-admin-plus/es/utils/resolvers';
import VueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig(({ command, mode }) => {
  const isBuild = command === 'build';
  const env = loadEnv(mode, process.cwd());
  const alias = {
    '@/': resolve('src') + '/',
    'ele-admin-plus': resolve('node_modules/@hnjing/zxzy-admin-plus') + '/',
    'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
  };
  const plugins = [vue()];
  if (isBuild) {
    // 组件按需引入
    plugins.push(
      Components({
        dts: false,
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass'
          }),
          EleAdminResolver({
            importStyle: 'sass'
          })
        ]
      })
    );
    // gzip压缩
    plugins.push(
      Compression({
        disable: !isBuild,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      })
    );
    alias['./as-needed'] = './global-import';
  } else {
    // 开发环境全局安装
    plugins.push(VueDevTools());
    alias['./as-needed'] = './global-import';
  }
  return {
    resolve: { alias },
    plugins,
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;`,
          silenceDeprecations: ['legacy-js-api']
        }
      }
    },
    base: './',
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT),
      open: true, // 运行是否自动打开浏览器
      proxy: {
        // 反向代理解决跨域
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_BASE_API_URL, // 线上接口地址
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '') // 替换 /dev-api 为 target 接口地址
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
          rewrite: (path) =>
            path.replace(new RegExp('^' + env.VITE_APP_BUSINESS_BASE_API), '') // 文件分片微服务
        },
        warmup: {
          clientFiles: ['./index.html', './src/{views,components}/*']
        }
      }
    },
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/renderers',
        'echarts/components',
        'vue-echarts',
        'echarts-wordcloud',
        'sortablejs',
        'vuedraggable'
      ]
    },
    build: {
      target: 'chrome63',
      chunkSizeWarningLimit: 2000,
      terserOptions:
        command === 'build'
          ? {
              // 仅在构建时生效
              compress: {
                drop_console: true, // 移除console
                drop_debugger: true // 移除debugger
              }
            }
          : {}
    }
  };
});
