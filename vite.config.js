import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    base: "/",
    plugins: [],
    build: {
      outDir: "build",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: (path) => path.split('/').reverse()[path.split('/').reverse().indexOf('node_modules') - 1]
        },
      },
    },
    envPrefix: "PUBLIC_",
    resolve: {
      alias: [
        { find: '@', replacement: path.join(path.resolve(__dirname, 'src')) }
      ]
    }
  })