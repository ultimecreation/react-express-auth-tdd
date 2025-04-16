import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // resolve: {
  //   // this line is important so the "browser build" of dependencies is used
  //   // and not the "SSR build", which would contain "streaming-to-the-browser"
  //   // specific code
  //   // "node" is important so it picks up the right msw import.
  //   conditions: ["browser", "node"],
  // },
  // test: {
  //   globals: true,
  //   environment: "jsdom"
  // },
})
