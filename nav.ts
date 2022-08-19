export type NavItem = {
  name: string
  to: string
  items?: NavItem[]
}

export const NavigationList: NavItem[] = [
  {
    name: 'Voluptate Non Enim',
    to: '/',
    items: [
      { name: 'Ea Dolor Ad Hic Soluta', to: '/' },
      { name: 'Magnam Ratione Quos Sit', to: '/b' },
      { name: 'Quia Ut Et Nisi Qui', to: '/c' },
      { name: 'Exercitationem Aut Alias', to: '/d' }
    ]
  },
  {
    name: 'Voluptate Non Enim',
    to: '/',
    items: [
      { name: 'Ea Dolor Ad Hic Soluta', to: '/z' },
      { name: 'Magnam Ratione Quos Sit', to: '/e' },
      { name: 'Quia Ut Et Nisi Qui', to: '/f' },
      { name: 'Exercitationem Aut Alias', to: '/g' }
    ]
  }
]
