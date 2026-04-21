import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this app from https://<user>.github.io/Better_Roads/
// If you rename the repo, change the `base` below to match.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? '/Better_Roads/' : '/',
})
