import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    server: {
        port: 80, // 🎯 port d'écoute
        host: true // 🔓 écoute sur 0.0.0.0 (important si tu es sur une VM ou un container)
    },
    plugins: [react()],
})
