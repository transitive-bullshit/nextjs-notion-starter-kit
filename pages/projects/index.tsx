import { NotionPage } from '@/components/NotionPage'
import * as config from '@/lib/config'
import { projectDomain } from '@/lib/config'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import type { PageProps } from '@/lib/types'

export const getStaticProps = async () => {
    try {
        const props = await resolveNotionPage(projectDomain, config.rootNotionProjectPageId)
        return { props, revalidate: 10 }
    } catch (err) {
        console.error('page error', projectDomain, err)
        throw err
    }
}

export default function NotionDomainPage(props: PageProps) {

    return <NotionPage {...props} />
}
