import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('@react-three') || id.includes('node_modules/three')) return 'three'
          if (id.includes('@mui') || id.includes('@emotion')) return 'mui'
          if (id.includes('@radix-ui')) return 'radix-ui'
          if (id.includes('lucide-react')) return 'lucide'
          // motion kept in vendor — separate chunk caused motion ↔ vendor circular dependency
          if (id.includes('gsap')) return 'gsap'
          if (id.includes('@tanstack/react-query')) return 'tanstack-query'
          if (id.includes('react-router')) return 'react-router'
          if (id.includes('react-dom')) return 'react-dom'
          if (id.includes('node_modules/react/')) return 'react'
          return 'vendor'
        },
      },
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
