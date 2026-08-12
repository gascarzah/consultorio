import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: process.env.DOCKER === 'true' ? false : true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  test: {
    environment: 'node',
    setupFiles: ['./src/test/setup.js'],
  },
  build: {
    chunkSizeWarningLimit: 1600,
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
    port: 5173,
    host: true,
    cors: {
      origin: ['http://localhost:3000'],
      credentials: true
    }
  }
})
