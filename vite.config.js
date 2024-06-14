import react from '@vitejs/plugin-react'

export default {
  plugins: [react()],
  server: {
    host: true, // This will use your machine's host (default: 'localhost')
    strictPort: true, // This will make Vite fail if the port is already in use (default: false)
    port: 8000, // Specify the port you want to use
  },
  resolve: {
    // Your resolve options
  },
};
