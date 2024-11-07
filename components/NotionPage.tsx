import * as React from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import cs from 'classnames'
// import { PageBlock } from 'notion-types'
import { formatDate, getBlockTitle, getPageProperty } from 'notion-utils'
import BodyClassName from 'react-body-classname'
import { NotionRenderer } from 'react-notion-x'
import TweetEmbed from 'react-tweet-embed'
import { useSearchParam } from 'react-use'

import * as config from '@/lib/config'
import * as types from '@/lib/types'
import { mapImageUrl } from '@/lib/map-image-url'
import { getCanonicalPageUrl, mapPageUrl } from '@/lib/map-page-url'
import { searchNotion } from '@/lib/search-notion'
import { useDarkMode } from '@/lib/use-dark-mode'

import { Footer } from './Footer'
import { GitHubShareButton } from './GitHubShareButton'
import { Loading } from './Loading'
import { NotionPageHeader } from './NotionPageHeader'
import { Page404 } from './Page404'
import { PageAside } from './PageAside'
import { PageHead } from './PageHead'
import styles from './styles.module.css'

// -----------------------------------------------------------------------------
// dynamic imports for optional components
// -----------------------------------------------------------------------------

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then(async (m) => {
    // add / remove any prism syntaxes here
    await Promise.allSettled([
      import('prismjs/components/prism-markup-templating.js'),
      import('prismjs/components/prism-markup.js'),
      import('prismjs/components/prism-bash.js'),
      import('prismjs/components/prism-c.js'),
      import('prismjs/components/prism-cpp.js'),
      import('prismjs/components/prism-csharp.js'),
      import('prismjs/components/prism-docker.js'),
      import('prismjs/components/prism-java.js'),
      import('prismjs/components/prism-js-templates.js'),
      import('prismjs/components/prism-coffeescript.js'),
      import('prismjs/components/prism-diff.js'),
      import('prismjs/components/prism-git.js'),
      import('prismjs/components/prism-go.js'),
      import('prismjs/components/prism-graphql.js'),
      import('prismjs/components/prism-handlebars.js'),
      import('prismjs/components/prism-less.js'),
      import('prismjs/components/prism-makefile.js'),
      import('prismjs/components/prism-markdown.js'),
      import('prismjs/components/prism-objectivec.js'),
      import('prismjs/components/prism-ocaml.js'),
      import('prismjs/components/prism-python.js'),
      import('prismjs/components/prism-reason.js'),
      import('prismjs/components/prism-rust.js'),
      import('prismjs/components/prism-sass.js'),
      import('prismjs/components/prism-scss.js'),
      import('prismjs/components/prism-solidity.js'),
      import('prismjs/components/prism-sql.js'),
      import('prismjs/components/prism-stylus.js'),
      import('prismjs/components/prism-swift.js'),
      import('prismjs/components/prism-wasm.js'),
      import('prismjs/components/prism-yaml.js')
    ])
    return m.Code
  })
)

const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  {
    ssr: false
  }
)
const Modal = dynamic(
  () =>
    import('react-notion-x/build/third-party/modal').then((m) => {
      m.Modal.setAppElement('.notion-viewport')
      return m.Modal
    }),
  {
    ssr: false
  }
)

const Tweet = ({ id }: { id: string }) => {
  return <TweetEmbed tweetId={id} />
}

const propertyLastEditedTimeValue = (
  { block, pageHeader },
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && block?.last_edited_time) {
    return `Last updated ${formatDate(block?.last_edited_time, {
      month: 'long'
    })}`
  }

  return defaultFn()
}

const propertyDateValue = (
  { data, schema, pageHeader },
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'published') {
    const publishDate = data?.[0]?.[1]?.[0]?.[1]?.start_date

    if (publishDate) {
      return `${formatDate(publishDate, {
        month: 'long'
      })}`
    }
  }

  return defaultFn()
}

const propertyTextValue = (
  { schema, pageHeader },
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'author') {
    return <b>{defaultFn()}</b>
  }

  return defaultFn()
}

export const NotionPage: React.FC<types.PageProps> = ({
  site,
  recordMap,
  error,
  pageId
}) => {
  const router = useRouter()
  const lite = useSearchParam('lite')

  function wrapElementsBetweenBlanks() {
    // Select all .notion-blank div elements
    const blankDivs = document.querySelectorAll('.notion-blank')

    // Exit if there are less than 2 .notion-blank divs, as no wrapping is needed
    if (blankDivs.length < 2) return

    // Iterate over each .notion-blank div except the last one
    blankDivs.forEach((blankDiv, index) => {
      // Only proceed if there's a subsequent .notion-blank div
      if (index < blankDivs.length - 2) {
        const elementsToWrap = []
        let nextSibling = blankDiv.nextElementSibling

        // Collect all elements until reaching the next .notion-blank div
        while (nextSibling && !nextSibling.classList.contains('notion-blank')) {
          elementsToWrap.push(nextSibling)
          nextSibling = nextSibling.nextElementSibling
        }

        // If there are elements to wrap, create a custom-wrapper div
        if (elementsToWrap.length > 0) {
          const wrapperDiv = document.createElement('div')
          wrapperDiv.classList.add('custom-wrapper-class')

          // Move each collected element into the custom-wrapper
          elementsToWrap.forEach((element) => {
            wrapperDiv.appendChild(element)
          })

          // Insert the custom-wrapper div after the current .notion-blank div
          blankDiv.insertAdjacentElement('afterend', wrapperDiv)
        }
      }
    })
  }

  function wrapHeadersAndContent() {
    // Select all .notion-h3 elements
    const headers = document.querySelectorAll('.notion-h3')

    headers.forEach((header, index) => {
      const elementsToWrap = [header] // Start by including the header itself
      let nextSibling = header.nextElementSibling

      // Collect all elements until we reach the next .notion-h3 header
      while (
        nextSibling &&
        (!nextSibling.classList.contains('notion-h3') ||
          index === headers.length - 1)
      ) {
        elementsToWrap.push(nextSibling)
        nextSibling = nextSibling.nextElementSibling
      }

      // Create a custom-wrapper-class div and add the collected elements to it
      const wrapperDiv = document.createElement('div')
      wrapperDiv.classList.add('lecture-wrapper')

      // Insert the wrapper before the first element in elementsToWrap
      header.parentNode.insertBefore(wrapperDiv, header)

      // Move each collected element into the custom-wrapper
      elementsToWrap.forEach((element) => {
        wrapperDiv.appendChild(element)
      })
    })
  }

  React.useEffect(() => {
    document.querySelectorAll('summary').forEach(function (summary) {
      // Select the <b> tag inside the <summary>
      const boldTag = summary.querySelector('b')

      // If a <b> tag exists, replace it with its text content
      if (boldTag) {
        boldTag.replaceWith(boldTag.textContent)
      }
    })

    document.querySelectorAll('.notion-page-title-text').forEach((link) => {
      if (link.textContent.trim().toLowerCase() === 'about') {
        link.remove()
      }
    })

    // Header
    const header = document.querySelector('.breadcrumbs')
    if (header) {
      const nav = document.createElement('nav')
      nav.classList.add('nav-container') // Optionally add a class to the <nav> tag for styling

      const links = [
        { href: '/', label: 'Coursetexts' },
        { href: '/about-9a2ace4be0dc4d928e7d304a44a6afe8', label: 'About' }
      ]

      links.forEach((link) => {
        const anchor = document.createElement('a')
        anchor.href = link.href
        anchor.textContent = link.label
        anchor.classList.add('nav-link') // Add styling class to <a> tag
        nav.appendChild(anchor) // Append each <a> to the <nav>
      })

      header.appendChild(nav) // Append <nav> to the .notion-nav-header
    }

    // Execute the function to wrap elements

    if (router.pathname === '/') {
      wrapElementsBetweenBlanks()
      const details1Element = document.querySelectorAll('.notion-link')

      if (details1Element instanceof HTMLElement) {
        details1Element.style.borderBottom = 'none';  // Removing the border bottom
      }
    } else {
      wrapHeadersAndContent()
    }

    const addSeeAllClassesButton = () => {
      // Locate the notion-callout div
      const notionCallout = document.querySelector('.notion-callout')
      if (notionCallout) {
        // Create the button container div
        const buttonContainer = document.createElement('div')
        buttonContainer.className = 'button-container1'

        // Create the button element
        const button = document.createElement('button')
        button.textContent = 'See All Classes →'
        button.className = 'see-all'

        // Add click event to navigate to the classes page
        button.onclick = () => router.push('/')

        // Append the button to the container
        buttonContainer.appendChild(button)

        // Insert the button container after the notion-callout div
        notionCallout.insertAdjacentElement('afterend', buttonContainer)
      }
    }

    function setDropdownOpen() {
      // Select all details elements
      const detailsElements = document.querySelectorAll('details')

      detailsElements.forEach((detailsElement) => {
        detailsElement.setAttribute('open', 'true') // Open the dropdown
        detailsElement.style.borderBottom = '1px solid hsl(214.3, 31.8%, 91.4%)'
      })
    }

    if (router.asPath == '/about-9a2ace4be0dc4d928e7d304a44a6afe8') {
      setDropdownOpen()
      addSeeAllClassesButton()
    }
  }, [router])

  const components = React.useMemo(
    () => ({
      nextImage: Image,
      nextLink: Link,
      Code,
      Collection,
      Equation,
      Pdf,
      Modal,
      Tweet,
      Header: NotionPageHeader,
      propertyLastEditedTimeValue,
      propertyTextValue,
      propertyDateValue
    }),
    []
  )

  // lite mode is for oembed
  const isLiteMode = lite === 'true'

  const { isDarkMode } = useDarkMode()

  const siteMapPageUrl = React.useMemo(() => {
    const params: any = {}
    if (lite) params.lite = lite

    const searchParams = new URLSearchParams(params)
    return mapPageUrl(site, recordMap, searchParams)
  }, [site, recordMap, lite])

  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value

  // const isRootPage =
  //   parsePageId(block?.id) === parsePageId(site?.rootNotionPageId)
  const isBlogPost =
    block?.type === 'page' && block?.parent_table === 'collection'

  const showTableOfContents = !!isBlogPost
  const minTableOfContentsItems = 3

  const pageAside = React.useMemo(
    () => (
      <PageAside block={block} recordMap={recordMap} isBlogPost={isBlogPost} />
    ),
    [block, recordMap, isBlogPost]
  )

  const footer = React.useMemo(() => <Footer />, [])

  if (router.isFallback) {
    return <Loading />
  }

  if (error || !site || !block) {
    return <Page404 site={site} pageId={pageId} error={error} />
  }

  const title = getBlockTitle(block, recordMap) || site.name

  console.log('notion page', {
    isDev: config.isDev,
    title,
    pageId,
    rootNotionPageId: site.rootNotionPageId,
    recordMap
  })

  if (!config.isServer) {
    // add important objects to the window global for easy debugging
    const g = window as any
    g.pageId = pageId
    g.recordMap = recordMap
    g.block = block
  }

  const canonicalPageUrl =
    !config.isDev && getCanonicalPageUrl(site, recordMap)(pageId)

  const socialImage = null

  const socialDescription =
    getPageProperty<string>('Description', block, recordMap) ||
    config.description

  return (
    <>
      <PageHead
        pageId={pageId}
        site={site}
        title={title}
        description={socialDescription}
        image={socialImage}
        url={canonicalPageUrl}
      />

      {isLiteMode && <BodyClassName className='notion-lite' />}
      {isDarkMode && <BodyClassName className='dark-mode' />}

      <NotionRenderer
        bodyClassName={cs(
          styles.notion,
          pageId === site.rootNotionPageId && 'index-page'
        )}
        darkMode={isDarkMode}
        components={components}
        recordMap={recordMap}
        rootPageId={site.rootNotionPageId}
        rootDomain={site.domain}
        fullPage={!isLiteMode}
        previewImages={!!recordMap.preview_images}
        showCollectionViewDropdown={false}
        showTableOfContents={showTableOfContents}
        minTableOfContentsItems={minTableOfContentsItems}
        defaultPageIcon={null}
        defaultPageCover={config.defaultPageCover}
        defaultPageCoverPosition={config.defaultPageCoverPosition}
        mapPageUrl={siteMapPageUrl}
        mapImageUrl={mapImageUrl}
        searchNotion={config.isSearchEnabled ? searchNotion : null}
        pageAside={null}
        footer={footer}
      />
      {router.asPath == '/about-9a2ace4be0dc4d928e7d304a44a6afe8' && (
        <div onClick={() => router.push('/')} className='button-container'>
          <button className='see-all'>See All Classes →</button>
        </div>
      )}
      {/* <GitHubShareButton /> */}
    </>
  )
}
