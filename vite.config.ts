import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Use loopback IP so Vite does not call getaddrinfo('localhost'). Some
    // setups (hosts/DNS/VPN) return ENOTFOUND for localhost otherwise.
    host: '127.0.0.1',
  },
})
