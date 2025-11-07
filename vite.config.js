// vite.config.ts (hoặc .js)
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // đọc .env.[mode] với prefix bất kỳ
  const API_TARGET = env.VITE_API_URL || 'http://40.82.145.164:8080' // URL BE
  const BASE_PATH  = env.VITE_BASE_PATH || '/'                    // base cho build

  return {
    plugins: [react(), tailwindcss()],
    base: BASE_PATH,
    server: {
      port: Number(env.VITE_PORT || 5173),
      // Proxy các đường dẫn gọi BE
      proxy: {
        // REST API
        '/api': {
          target: API_TARGET,
          changeOrigin: true,
          secure: false, // nếu BE dùng HTTPS self-signed thì để false
          // Nếu BE KHÔNG có prefix /api, bỏ comment dòng dưới để xóa prefix khi forward:
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },

        // Static files (nếu BE phục vụ ảnh/file)
        '/uploads': {
          target: API_TARGET,
          changeOrigin: true,
          secure: false,
        },

        // WebSocket (nếu có, ví dụ /socket, /ws, /signalr)
        '/socket': {
          target: API_TARGET.replace(/^http/, 'ws'),
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'dist',
    },
  }
})
