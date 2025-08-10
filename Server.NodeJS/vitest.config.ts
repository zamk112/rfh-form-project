import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./src/Tests/setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            reportsDirectory: './coverage',
            exclude: 
            [
                'node_modules/',
                'src/Tests/',
                'dist/',
                '**/*.d.ts',
                '**/*.test.ts',
                '**/*.spec.ts'
            ],
            thresholds: 
            {
                global: 
                {
                    branches: 80,
                    functions: 80,
                    lines: 80,
                    statements: 80
                }
            }
        },
        include: ['src/**/*.{test,spec}.ts'],
        exclude: [
            'node_modules/',
            'dist/',
        ]
    },
    resolve: {
        alias: { '@': path.resolve(__dirname, './src') }
    }
});