import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
export default defineConfig({
  plugins: [vue(),
  dts({
    tsconfigPath: 'tsconfig.json',
    insertTypesEntry: true, // 自动在 index.d.ts 中添加 export
    outDir: 'lib/types',
    // 优化类型生成性能
  }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    // 优化解析性能
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  // 优化开发和构建缓存
  cacheDir: 'node_modules/.vite',
  build: {
    outDir: 'lib',
    // 开启最小化
    minify: 'terser',
    // 配置 terser 压缩选项
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
      },
    },
    // 优化 CSS 处理
    cssCodeSplit: false,
    sourcemap: false,
    // 配置 chunk 大小警告限制
    chunkSizeWarningLimit: 1000,
    lib: {
      entry: 'src/index.ts',
      name: 'vue3-common',
      fileName: (format) => `vue3-common.${format}.js`,
      cssFileName: "vue3-common",
      formats: ['es'],
    },
    rollupOptions: {
      // 确保所有第三方库都正确标记为外部依赖
      external: [
        'vue', 
        'ant-design-vue',
        'lodash-es', 
      ],
      output: {
        exports: "named",
        globals: {
          vue: 'Vue',
          'lodash-es': 'LodashEs',
        },
        // 优化输出格式
        compact: true,
      },
      // 配置 tree-shaking 以移除未使用的代码
      treeshake: {
        preset: 'smallest',
        moduleSideEffects: false,
      },
      // 优化构建性能
      cache: true,
    }
  }
})
