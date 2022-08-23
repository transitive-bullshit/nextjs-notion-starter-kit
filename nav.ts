export type NavItem = {
  name: string
  to: string
  items?: NavItem[]
}

export const NavigationList: NavItem[] = [
  {
    name: 'Main',
    to: '/',
    items: [
      { name: 'Home', to: '/' },
      { name: '8 aнгийн хичээлийн хуваарь', to: '/8' },
      { name: '9 aнгийн хичээлийн хуваарь', to: '/9' }
    ]
  }
]
