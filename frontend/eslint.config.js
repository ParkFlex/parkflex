import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import {defineConfig, globalIgnores} from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            '@stylistic': stylistic
        },
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },

        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            '@stylistic/indent': ["warn", 4],
            '@stylistic/semi': "warn",
            '@stylistic/max-len': ["warn", {
                code: 100
            }]
        }
    },
])
