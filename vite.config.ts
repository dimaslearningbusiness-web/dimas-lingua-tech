import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

export default defineConfig({
  // Esta linha diz ao site para funcionar no subdiretório do GitHub
  base: '/dimas-lingua-tech/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
