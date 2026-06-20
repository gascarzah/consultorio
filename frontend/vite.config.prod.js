import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// Configuración optimizada para producción (subpath en gafah.dev/consultorios)
export default defineConfig({
  base: '/consultorios/',
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  build: { 
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('react-router-dom')) return 'router';
          if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) return 'redux';
          if (id.includes('@headlessui/react') || id.includes('@heroicons/react')) return 'ui';
          if (id.includes('formik') || id.includes('yup')) return 'forms';
          if (id.includes('react-big-calendar') || id.includes('react-calendar') || id.includes('react-datepicker')) return 'calendar';
          if (id.includes('axios') || id.includes('dayjs') || id.includes('jwt-decode')) return 'utils';
          if (id.includes('react') || id.includes('react-dom')) return 'vendor';
          return 'vendor';
        }
      }
    }
  },
  server: {
    cors: {
      origin: ['http://localhost:3000'],
      credentials: true
    }
  }
})
