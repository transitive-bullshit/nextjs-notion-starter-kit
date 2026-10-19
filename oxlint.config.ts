import config from '@fisch0920/config/oxlint'

export default {
  extends: [config],
  rules: {
    'react/set-state-in-effect': 'off',
    'react/refs': 'off'
  }
}
