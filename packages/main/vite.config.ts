import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import checker from 'vite-plugin-checker'
import path from 'path'
import { compression } from 'vite-plugin-compression2'
import { createHtmlPlugin } from 'vite-plugin-html'
import svgr from 'vite-plugin-svgr'
import autoprefixer from 'autoprefixer'
import LessPluginImportNodeModules from 'less-plugin-import-node-modules'
import fs from 'node:fs'
import { comlink } from 'vite-plugin-comlink'
import eslint from 'vite-plugin-eslint'

const DEV_HOST = 'localhost'
const DEV_PORT = 8081
const proxy: Record<string, any> = {}
// https://vitejs.dev/config/
export default defineConfig(async () => {
  return {
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
      }),
      eslint(),
      checker({
        typescript: {
          tsconfigPath: path.resolve(__dirname, './tsconfig.json'),
        },
      }),
      compression({
        compressionOptions: {
          ext: '.gz',
          algorithm: 'gzip',
          deleteOriginFile: false,
          verbose: false,
        },
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: process.env.VITE_APP_TITLE || 'qinakun',
          },
        },
        template: './index.html',
      }),
      svgr({
        svgrOptions: { icon: true },
      }),
      comlink(),
    ],
    worker: {
      plugins: [comlink()],
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          plugins: [new LessPluginImportNodeModules()],
        },
      },
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: ['Chrome > 50', 'ff > 31', 'ie 11'],
          }),
        ],
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: { '.js': 'jsx' },
        plugins: [
          {
            name: 'load-js-files-as-jsx',
            setup(build) {
              build.onLoad(
                { filter: /src\/.*\.js$/ },
                (args) =>
                  ({
                    loader: 'jsx',
                    contents: fs.readFileSync(args.path, 'utf8'),
                  } as any),
              )
            },
          },
        ],
      },
    },
    build: {
      chunkSizeWarningLimit: 1024,
      outDir: 'dist',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    define: {
      'process.env.VITE_MICRO_MODE': JSON.stringify(
        process.env.VITE_MICRO_MODE,
      ),
    },
    assetsInclude: ['**/*.swf'],
    resolve: {
      alias: [
        {
          find: /^~/,
          replacement: '',
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, './src'),
        },
      ],
    },
    server: {
      cors: true,
      port: DEV_PORT,
      hmr: {
        host: DEV_HOST,
        port: DEV_PORT,
      },
      proxy,
    },
  } as any
})
