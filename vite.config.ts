import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

export default defineConfig({
  // ADICIONA ESTA LINHA ABAIXO (usa o nome exato do teu repositório no GitHub)
  base: '/dimas-lingua-tech/', 
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
