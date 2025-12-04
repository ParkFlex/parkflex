/// <reference types="vitest/config" />
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    base: "/",
    plugins: [react()],
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ["global-builtin", "color-functions", "import"]
            }
        }
    },
    test: {
        environment: "jsdom",
        globals: true,
    },
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ["global-builtin", "color-functions", "import"],
            }
        }
    }
})
