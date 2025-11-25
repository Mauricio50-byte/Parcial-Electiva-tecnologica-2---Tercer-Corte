module.exports = [
  {
    files: ['**/*.js'],
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: {
        module: 'readonly',
        require: 'readonly',
        console: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      eqeqeq: ['error', 'always'],
      'no-unused-vars': ['error', { args: 'after-used', ignoreRestSiblings: true }],
      'no-console': 'warn',
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      curly: ['error', 'all'],
    },
  },
];