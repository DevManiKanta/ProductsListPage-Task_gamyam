// Vite configuration - handles the build process and dev server
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // SWC is faster than Babel
import path from "path";

// Export a function so we can access the mode (development/production)
export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Listen on all interfaces
    port: 8080, // Development server port
  },
  plugins: [
    react(), // React support with SWC
  ],
  resolve: {
    alias: {
      // Set up @ alias to point to src directory - makes imports cleaner
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
}));