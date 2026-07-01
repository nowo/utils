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
    {
        // 文档（markdown）代码块只作示意，关闭格式/未用/console 等噪声规则；
        // 语法错误及 markdown 结构仍会正常校验
        files: ['**/*.md/**'],
        rules: {
            'style/indent': 'off',
            'style/semi': 'off',
            'style/quotes': 'off',
            'style/comma-dangle': 'off',
            'prefer-const': 'off',
            'no-console': 'off',
            'no-unused-vars': 'off',
            'unused-imports/no-unused-vars': 'off',
        },
    },
)
