import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    server: {
        port: 80, // 🎯 port d'écoute
        host: true, // 🔓 écoute sur 0.0.0.0 (important si tu es sur une VM ou un container)
        strictPort: true,
        hmr: {
            protocol: 'ws',
            host: 'localhost',
        },
        allowedHosts: "all",
    },
    plugins: [react()],
})
