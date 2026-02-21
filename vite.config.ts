import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  },
  server: {
    host: "0.0.0.0",   // bind to all interfaces — accessible via Tailscale
    port: 8203,
    proxy: {
      // Dev proxy: forward /api/* to the FastAPI backend
      "/api": {
        target: "http://localhost:8201",
        changeOrigin: true,
        ws: true          // proxy WebSocket too
      }
    }
  },
  preview: {
    host: "0.0.0.0",
    port: 8203
  }
})
