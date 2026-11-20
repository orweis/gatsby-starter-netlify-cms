// ESLint flat config: https://eslint.org/docs/latest/use/configure/
const js = require('@eslint/js')
const globals = require('globals')
const react = require('eslint-plugin-react')
const reactHooks = require('eslint-plugin-react-hooks')
const jsxA11y = require('eslint-plugin-jsx-a11y')
const jest = require('eslint-plugin-jest')

module.exports = [
  {
    ignores: ['public/', '.cache/', 'coverage/', 'node_modules/', 'static/'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    plugins: { react, 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      // Files keep `import React` (classic JSX runtime in tests).
      'react/jsx-uses-react': 'error',
      // Allow `const { omitted, ...rest } = props` to drop properties.
      'no-unused-vars': ['error', { ignoreRestSiblings: true }],
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      // Labels in the contact forms wrap their inputs (Bulma file input markup).
      'jsx-a11y/label-has-associated-control': [
        'error',
        { assert: 'either', depth: 3 },
      ],
    },
  },
  {
    // Node.js (CommonJS) files: Gatsby config/APIs, functions, tooling.
    files: [
      'gatsby-*.js',
      'gatsby/**/*.js',
      'lambda/**/*.js',
      'src/utils/tags.js',
      'src/utils/templates.js',
      '*.config.js',
      'test/jest-preprocess.js',
      'test/setup-tests.js',
      '__mocks__/**/*.js',
    ],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
  {
    files: ['test/**/*.js', '__mocks__/**/*.js'],
    ...jest.configs['flat/recommended'],
    languageOptions: {
      globals: { ...globals.jest, ...globals.node, ...globals.browser },
    },
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'react/prop-types': 'off',
      'react/display-name': 'off',
    },
  },
]
