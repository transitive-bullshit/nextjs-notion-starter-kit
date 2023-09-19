import test from 'ava'

import { NotionAPI } from './notion-api'

const pageIdFixturesSuccess = [
  '067dd719-a912-471e-a9a3-ac10710e7fdf',
  '067dd719a912471ea9a3ac10710e7fdf',
  'https://www.notion.so/saasifysh/Embeds-5d4e290ca4604d8fb809af806a6c1749',
  'https://www.notion.so/saasifysh/File-Uploads-34d650c65da34f888335dbd3ddd141dc',
  'Color-Rainbow-54bf56611797480c951e5c1f96cb06f2',
  'e68c18a461904eb5a2ddc3748e76b893',
  'https://www.notion.so/saasifysh/Saasify-Key-Takeaways-689a8abc1afa4699905aa2f2e585e208',
  'https://www.notion.so/saasifysh/TransitiveBullsh-it-78fc5a4b88d74b0e824e29407e9f1ec1',
  'https://www.notion.so/saasifysh/About-8d0062776d0c4afca96eb1ace93a7538',
  'https://www.notion.so/potionsite/newest-board-a899b98b7cdc424585e5ddebbdae60cc'

  // collections stress test
  // NOTE: removing because of sporadic timeouts
  // 'nba-3f92ae505636427c897634a15b9f2892'
]

const pageIdFixturesFailure = [
  'bdecdf150d0e40cb9f3412be132335d4', // private page
  'foo' // invalid page id
]

for (const pageId of pageIdFixturesSuccess) {
  test(`NotionAPI.getPage success ${pageId}`, async (t) => {
    t.timeout(60000) // one minute timeout

    const api = new NotionAPI()
    const page = await api.getPage(pageId)

    t.truthy(page)
    t.truthy(page.block)
  })
}

for (const pageId of pageIdFixturesFailure) {
  test(`NotionAPI.getPage failure ${pageId}`, async (t) => {
    const api = new NotionAPI()
    await t.throwsAsync(() => api.getPage(pageId))
  })
}
