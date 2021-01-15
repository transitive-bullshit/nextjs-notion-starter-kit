import * as types from './types'

// mock database for testing purposes
export const sites: Partial<types.Site>[] = [
  {
    name: 'Notion2Site Demo',
    domain: 'localhost',
    // rootNotionPageId: 'dc6f890fec6b4766bd9b616324904187',
    rootNotionPageId: '2988138f78424344b67db048e3792229',
    rootNotionSpaceId: 'fde5ac74-eea3-4527-8f00-4482710e1af3',
    // fontFamily: 'Oxygen',
    description: 'This is a demo website powered by Notion2Site.',
    image: 'https://storage.googleapis.com/saasify-assets/notion2site-v2.jpg',
    html: `<script>console.log(\`\n\nHello from custom JS injected into this page.\n\n\`)</script>`
  }
]
