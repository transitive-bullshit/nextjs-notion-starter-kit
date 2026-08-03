import { config } from '@fisch0920/config/eslint'

// Filter out unicorn plugin configs from upstream — too strict for this fork
const baseConfig = config.filter(
  (c) => !c?.plugins?.unicorn && !c?.rules?.['unicorn/catch-error-name']
)

export default [
  {
    ignores: [
      '.next/**',
      '.open-next/**',
      '.wrangler/**',
      'node_modules/**',
      'public/**'
    ]
  },
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'react/prop-types': 'off',
      '@typescript-eslint/prefer-for-of': 'off',
      '@typescript-eslint/naming-convention': 'off',
      'no-process-env': 'off',
      'array-callback-return': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/media-has-caption': 'off',
      'jsx-a11y/interactive-supports-focus': 'off',
      'jsx-a11y/anchor-is-valid': 'off'
    }
  }
]
