export default [
    {
      ignores: ['node_modules/**', 'dist/**'], // Ignore node_modules and any build files
    },
    {
      files: ['**/*.js'], // Apply rules to all JavaScript files
      languageOptions: {
        ecmaVersion: 'latest', // Latest ECMAScript features
        sourceType: 'module',
      },
      rules: {
        'no-unused-vars': 'warn', // Warn on unused variables
        'no-console': 'off', // Allow console.logs (change to 'warn' to catch them)
        'semi': ['error', 'always'], // Ensure semicolons are used
        'quotes': ['error', 'single'], // Use single quotes for strings
        'eqeqeq': 'error', // Enforce strict equality (===)
        'indent': ['error', 2], // Enforce 2-space indentation
      },
      plugins: [],
    },
  ];