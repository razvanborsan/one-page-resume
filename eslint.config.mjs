import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.*', '*.cjs'],
  },
  eslint.configs.recommended,
  prettierConfig,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {jsx: true},
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',

      // Google TypeScript Style Guide — core rules
      'no-var': 'error',
      'prefer-const': 'error',
      'no-array-constructor': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-new-wrappers': 'error',
      eqeqeq: ['error', 'always', {null: 'ignore'}],
      curly: ['error', 'multi-line'],

      // Google TypeScript Style Guide — TypeScript-specific
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {prefer: 'type-imports'},
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/array-type': [
        'error',
        {default: 'array-simple'},
      ],
      '@typescript-eslint/consistent-type-definitions': [
        'error',
        'interface',
      ],
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {argsIgnorePattern: '^_', varsIgnorePattern: '^_'},
      ],

      // No default exports (Google TypeScript Style Guide)
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message:
            'Use named exports instead of default exports (Google TypeScript Style Guide).',
        },
      ],

      // Disable base rules replaced by @typescript-eslint or TypeScript itself
      'no-unused-vars': 'off',
      // TypeScript handles undefined-variable checks; no-undef produces
      // false positives for globals like document, window, and JSX.
      'no-undef': 'off',
    },
  },
];
