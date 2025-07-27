const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');

module.exports = [
  // Performance optimization: exclude dependencies and generated files
  { ignores: ['node_modules/**', 'coverage/**'] },
  {
    // Base JavaScript configuration for Node.js environment
    ...js.configs.recommended,
    ...prettier,
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Node.js globals for Yeoman generator environment
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
      },
    },
    rules: {
      // Yeoman generators often use dynamic requires
      'import/no-dynamic-require': 'off',
      // Allow console.log in generator context for user feedback
      'no-console': 'off',
      // Prefer const for immutable bindings
      'prefer-const': 'error',
      // Consistent quote style
      quotes: ['error', 'single', { avoidEscape: true }],
    },
  },
];
