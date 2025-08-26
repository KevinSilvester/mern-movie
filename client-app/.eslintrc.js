module.exports = {
   root: true,
   env: {
      browser: true,
      es2021: true,
   },
   extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/jsx-runtime',
   ],
   overrides: [],
   parser: '@typescript-eslint/parser',
   parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
   },
   plugins: ['react', '@typescript-eslint', '@emotion'],
   settings: {
      react: {
         version: 'detect',
      },
   },
   rules: {
      '@emotion/jsx-import': 'error',
      '@emotion/pkg-renaming': 'error',
      '@emotion/no-vanilla': 'error',
      '@emotion/import-from-emotion': 'error',
      '@emotion/styled-import': 'error',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
      'react/prop-types': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: 'jsx' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
   },
}
