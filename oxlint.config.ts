import config from '@fisch0920/config/oxlint'

export default {
  extends: [config],
  rules: {
    'no-constant-condition': 'off',
    'typescript/consistent-indexed-object-style': 'off',
    'vitest/require-to-throw-message': 'off'
  }
}
