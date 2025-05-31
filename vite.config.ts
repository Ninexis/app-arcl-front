import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    server: {
        port: 80, // 🎯 port d'écoute
        host: true, // 🔓 écoute sur 0.0.0.0 (important si tu es sur une VM ou un container)
        allowedHosts: "web-lb-1331050834.eu-north-1.elb.amazonaws.com"
    },
    plugins: [react()],
})
