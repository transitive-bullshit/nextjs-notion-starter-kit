import { NotionPage } from '@/components/NotionPage'
import { domain } from '@/lib/config'
import { resolveNotionPage } from '@/lib/resolve-notion-page'

export const getStaticProps = async () => {
  try {
    const props = await resolveNotionPage(domain)

    return { props } // `revalidate` を削除して静的生成にする
  } catch (err) {
    console.error('page error', domain, err)

    // エラーが発生した場合は、エラーをスローしてページをビルドしないようにする
    throw err
  }
}

export default function NotionDomainPage(props) {
  return <NotionPage {...props} />
}
