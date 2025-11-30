import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/shadcn-pdf-with-highlights/',
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "@/ui": path.resolve(__dirname, "./src/ui"),
    },
  },
  server: {
    port: 3001,
  },
})
