import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base '/waiverflow/' targets the GitHub Pages project subpath (ipythoning.github.io/waiverflow/).
// Override at build time with BASE_PATH=/ when serving from a root domain (e.g. custom domain or Cloudflare Pages).
export default defineConfig({
  base: process.env.BASE_PATH ?? '/waiverflow/',
  plugins: [react()],
})
