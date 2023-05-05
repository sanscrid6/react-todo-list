import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
    // Load app-level env vars to node-level env vars.
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    return defineConfig({
      plugins: [react()],
      // To access env vars here use process.env.TEST_VAR
      define: {
        'process.env': process.env  
      }
    });
}