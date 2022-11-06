module.exports = {
   env: {
      browser: false,
      node: true,
      es2021: true
   },
   extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
   overrides: [],
   parser: '@typescript-eslint/parser',
   parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
   },
   plugins: ['@typescript-eslint'],
   rules: {
      '@typescript-eslint/ban-types': [
         'error',
         {
            extendDefaults: true,
            types: {
               '{}': false
            }
         }
      ],
      '@typescript-eslint/no-explicit-any': 'off'
   }
}
