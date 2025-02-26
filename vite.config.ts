/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // 設定為 jsdom 來測試 DOM 操作
  },
  base: process.env.GITHUB_PAGES ? '/react-weather-app/' : '/',
  server: {
    allowedHosts: ['vast-buses-glow.loca.lt'],
    host: '0.0.0.0', // 讓所有 IP 可以訪問
    port: 3000,
  },
})
