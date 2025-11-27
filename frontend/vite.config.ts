import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    base: "/web", // account for the frontend route
    plugins: [react()],
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ["global-builtin", "color-functions", "import"]
            }
        }
    }
})
