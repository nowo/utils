import defineConfig from '@wzo/eslint-config'

export default defineConfig(
    {
        // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
        ignores: [
            '*.sh',
            'lib',
            '*.woff',
            '*.ttf',
            '.vscode',
            'mock',
            'public',
            'bin',
            'build',
            'index.html',
            'vite.config.ts.timestamp*',
        ],
    },
    {
        rules: {
            'ts/no-use-before-define': [
                'error',
                {
                    variables: false,
                },
            ],
            'node/prefer-global/process': ['error', 'always'],
            'function-call-argument-newline': ['error', 'consistent'],
        },
    },
)
