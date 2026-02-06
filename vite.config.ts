import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // Mudamos de 'react' para 'react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/dimas-lingua-tech/',
  resolve: {
    alias: {
      "@": "/src",
    },
  },
})
