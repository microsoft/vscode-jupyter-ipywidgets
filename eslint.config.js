// @ts-check
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
const noOnlyTests = require('eslint-plugin-no-only-tests');
const prettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
    {
        ignores: ['build/**', 'dist/**', 'out/**', 'node_modules/**']
    },
    prettier,
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: ['tsconfig.json'],
                sourceType: 'module'
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2015
            }
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            import: importPlugin,
            'no-only-tests': noOnlyTests
        },
        rules: {
            'no-only-tests/no-only-tests': ['error', { block: ['test', 'suite'], focus: ['only'] }],
            '@typescript-eslint/ban-ts-comment': [
                'error',
                {
                    'ts-ignore': 'allow-with-description'
                }
            ],
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            'no-bitwise': 'off',
            'no-dupe-class-members': 'off',
            'no-empty-function': 'off',
            '@typescript-eslint/no-empty-function': ['error'],
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '_\\w*', caughtErrorsIgnorePattern: '_\\w*' }],
            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': [
                'error',
                {
                    functions: false
                }
            ],
            'no-useless-constructor': 'off',
            '@typescript-eslint/no-useless-constructor': 'error',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-floating-promises': 'error',
            'class-methods-use-this': 'off',
            'func-names': 'off',
            'import/extensions': 'off',
            'import/namespace': 'off',
            'import/no-extraneous-dependencies': 'off',
            'import/no-unresolved': [
                'error',
                {
                    ignore: ['monaco-editor', 'vscode']
                }
            ],
            'import/prefer-default-export': 'off',
            'linebreak-style': 'off',
            'no-await-in-loop': 'off',
            'no-console': 'off',
            'no-control-regex': 'off',
            'no-extend-native': 'off',
            'no-multi-str': 'off',
            'no-param-reassign': 'off',
            'no-prototype-builtins': 'off',
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'ForInStatement',
                    message:
                        'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
                },
                {
                    selector: 'LabeledStatement',
                    message:
                        'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
                },
                {
                    selector: 'WithStatement',
                    message:
                        '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
                }
            ],
            'no-template-curly-in-string': 'off',
            'no-underscore-dangle': 'off',
            'no-useless-escape': 'off',
            'no-void': [
                'error',
                {
                    allowAsStatement: true
                }
            ],
            'operator-assignment': 'off',
            strict: 'off'
        },
        settings: {
            'import/extensions': ['.ts', '.tsx', '.d.ts', '.js', '.jsx'],
            'import/external-module-folders': ['node_modules', 'node_modules/@types'],
            'import/parsers': {
                '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts']
            },
            'import/resolver': {
                node: {
                    extensions: ['.ts', '.tsx', '.d.ts', '.js', '.jsx']
                }
            }
        }
    }
];
