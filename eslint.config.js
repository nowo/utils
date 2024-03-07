import antfu from '@antfu/eslint-config'

export default antfu(
    {
        // unocss: true,
        // formatters: true,
        stylistic: {
            indent: 4, // 4, or 'tab'
            quotes: 'single', // or 'double'
        },
        // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
        ignores: [
            '*.sh',
            // 'node_modules',
            'lib',
            // '*.md',
            // '*.scss',
            '*.woff',
            '*.ttf',
            '.vscode',
            // '.idea',
            // 'dist',
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
            // 保存代码时缩进4个空格
            // 'indent': [
            //     'error',
            //     4,
            //     {
            //         SwitchCase: 1,
            //     },
            // ],
            // 'indent': ['error', 4],
            'no-console': [
                'warn',
                {
                    allow: ['error', 'warn'],
                },
            ],
            'curly': ['error', 'multi-line', 'consistent'],
            // 'brace-style': ['error', '1tbs', { allowSingleLine: true }],
            'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],

            // 'jsonc/indent': ['error', 4],
            // 'style/indent': ['error', 4],
            // '@typescript-eslint/brace-style': [
            //     'error',
            //     '1tbs',
            //     // {
            //     //   "allowSingleLine": true
            //     // }
            // ],
            // '@typescript-eslint/indent': 'off',
            'ts/no-use-before-define': [
                'error',
                {
                    variables: false,
                },
            ],
            'antfu/if-newline': 'off', // 允许if(a==1) return 1  这种单行的格式
            'antfu/top-level-function': 'off',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    // "varsIgnorePattern": "^_",
                    // "args": "after-used",
                    // "argsIgnorePattern": "^_"
                    argsIgnorePattern: '^',
                },
            ],
            // 'max-statements-per-line': ['error', { max: 2 }],
            'node/prefer-global/process': ['error', 'always'],
            'function-call-argument-newline': ['error', 'consistent'],

        },
    },
)
