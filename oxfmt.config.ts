import config from '@fisch0920/config/oxfmt'

export default {
  ...config,
  ignorePatterns: [
    'pnpm-workspace.yaml',
    '**/next-env.d.ts',
    'packages/notion-utils/fixtures',
    'packages/notion-x-to-md/examples'
  ]
}
