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
// import { GitHubShareButton } from './GitHubShareButton'
import { Loading } from './Loading'
import { NotionPageHeader } from './NotionPageHeader'
import { Page404 } from './Page404'
// import { PageAside } from './PageAside'
import { PageHead } from './PageHead'
import styles from './styles.module.css'

import ContentTable from './ContentTable'
import { createRoot, Root} from 'react-dom/client'  // React 18+
import FilterRow from './FilterRow'
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

type Section = {
  heading: string;
  links: { text: string; href: string }[];
};


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


// Example custom React component:
function License() {
  return (

    <div style={{ marginTop: '1rem',  marginLeft:'15px', fontFamily:'DM Mono', color:'#6B7280'}}>
      <p>All classes are licensed under the <i> <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en' target='_blank' rel="noreferrer">CC-BY-NC-SA</a></i> license</p>
    </div>
  )
}

// Helper function to append a React component:
function addReactComponentAtEndOfArticle(
  articleSelector: string, 
  containerClassName: string, 
  reactNode: React.ReactNode
) {
  const articleElement = document.querySelector(articleSelector)

  if (articleElement) {
    // Create a new div container
    const newContainer = document.createElement('div')
    newContainer.className = containerClassName
    
    // Append the new container as the last child of the article
    articleElement.appendChild(newContainer)

    // Render the passed-in React node using createRoot (React 18+)
    const root = createRoot(newContainer)
    root.render(reactNode)
  } else {
    console.warn(`Article element with selector "${articleSelector}" not found.`)
  }
}


// // Helper function to insert a React component after the Notion callout:
// function addReactComponentAfterCallout(reactNode: React.ReactNode) {
//   // Select the first notion-callout div
//   const notionCallout = document.querySelector('.notion-callout')

//   if (notionCallout) {
//     // Create a new container for our React component
//     const newContainer = document.createElement('div')
//     newContainer.className = 'fill-article-row'

//     // Insert the container right after the callout
//     notionCallout.insertAdjacentElement('afterend', newContainer) // also try beforebegin

//     // Render our React component into that container
//     const root = createRoot(newContainer)
//     root.render(reactNode)
//   } else {
//     console.warn(`No .notion-callout element found on the page.`)
//   }
// }



// Helper function to insert a React component after the Notion callout:
function addReactComponentBeforeTitle(reactNode: React.ReactNode) {
  // Select the first notion-callout div
  const notionCallout = document.querySelector('.notion-title')

  if (notionCallout) {
    // Create a new container for our React component
    const newContainer = document.createElement('div')
    newContainer.className = 'fill-article-row'

    // Insert the container right after the callout
    notionCallout.insertAdjacentElement('beforebegin', newContainer) // also try beforebegin

    // Render our React component into that container
    const root = createRoot(newContainer)
    root.render(reactNode)
  } else {
    console.warn(`No .notion-callout element found on the page.`)
  }
}



export const NotionPage: React.FC<types.PageProps> = ({
  site,
  recordMap,
  error,
  pageId
}) => {
  const router = useRouter()
  const lite = useSearchParam('lite')

  const [sections, setSections] = React.useState([]) // state for sections to be used for toggles

  // Lift the search and department states up here
  const [searchValue, setSearchValue] = React.useState('')
  const [department, setDepartment] = React.useState('All Departments')
  

  

  let pageClass = '';
  
  if (router.pathname === '/') {
    pageClass = 'notion-home';
  } else if (router.asPath.startsWith('/about')) {
    pageClass = 'about-page';
  } else if (router.asPath.startsWith('/why')) {
    pageClass = 'why-page';
  } else {
    pageClass = 'course-page';
  }


    // Keep a ref so we only create the root once
    const filterRootRef = React.useRef<Root | null>(null)

    
    // On mount, create the container + root *once*
    React.useEffect(() => {
      const notionCallout = document.querySelector('.notion-callout')
      if (!notionCallout) return
  
      // Insert a container for FilterRow after the .notion-callout
      const newContainer = document.createElement('div');
      newContainer.className = 'fill-article-row';
      
      // Insert it after the callout
      notionCallout.insertAdjacentElement('afterend', newContainer);
  
      // Create the React root
      filterRootRef.current = createRoot(newContainer)
    }, [])


    React.useEffect(() => {
      if (!filterRootRef.current) return
      if (pageClass == "notion-home") {
        filterRootRef.current.render(
          <FilterRow
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            department={department}
            setDepartment={setDepartment}
          />
        )
    }
    }, [searchValue, department])

  


  React.useEffect(() => {
    // Once the Notion content is rendered on client side,
    // you can insert your React component:
    if (pageClass == 'course-page') {
    addReactComponentAtEndOfArticle(
      'article',
      'fill-article-row',
      <ContentTable sections={sections}/>
    )
    }
  }, [router, sections, pageClass])

  React.useEffect(() => {
    addReactComponentAtEndOfArticle (
      'article',
      'fill-article-row',
      <License/>
    )
  }, [sections])

  React.useEffect(() => {
    // Once the Notion content is rendered on client side,
    // you can insert your React component:
    if (pageClass == 'course-page') {

    addReactComponentBeforeTitle( 
      <a href="/" style={{ textDecoration: 'none' }}>   
      <button style={{
        background: 'none',
        border: 'none',
        color: '#757575', // Gray color
        fontSize: '14px',
        fontWeight: '400',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        marginBottom: '1.5rem',
        padding: 0,
      }}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#757575" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          style={{ marginRight: '5px' }}
        >
          <line x1="5" y1="12" x2="19" y2="12" />  {/* Horizontal Line */}
          <polyline points="12 5 5 12 12 19" />  {/* Arrowhead */}
        </svg>
        Back to Archive
      </button>
      </a>
      )
    }

  }, [router])


    // 2) Filter .custom-wrapper-class each time searchValue or department changes
    React.useEffect(() => {
      if (pageClass == "notion-home") {
        // Grab all custom-wrapper-class blocks
        const customWrappers = document.querySelectorAll('.custom-wrapper-class');
        customWrappers.forEach((wrapper) => {
          const textContent = wrapper.textContent.toLowerCase();
          const matchesSearch = textContent.includes(searchValue.toLowerCase());

          const subjectContent = wrapper.querySelector('a.notion-link').textContent.toLowerCase();
          let matchesDepartment = true
          if (department !=  'All Departments') {
            matchesDepartment = subjectContent.includes(department.toLowerCase());
          }
    
          // Display the wrapper if it matches both the search and department criteria
          if (matchesSearch && matchesDepartment) {
            (wrapper as HTMLElement).style.display = 'block';
          } else {
            (wrapper as HTMLElement).style.display = 'none';
          }
        });
      }
    }, [searchValue, department]);

  function wrapElementsBetweenBlanks() {
    // Select all .notion-blank div elements
    const blankDivs = Array.from(document.querySelectorAll('.notion-blank'))

    // Exit if there are less than 2 .notion-blank divs, as no wrapping is needed
    if (blankDivs.length < 2) return

    // We will use a while loop to iterate over all .notion-blank elements
    let index = 0
    while (index < blankDivs.length - 1) {
      const blankDiv = blankDivs[index]
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

        // Since we inserted a wrapper, the next .notion-blank should be skipped
        index += 1
      } else {
        // Otherwise, move to the next .notion-blank
        index += 1
      }
    }
  }

  //wrapElementsBetweenDividersToCreateToggleTable

  // Function to wrap elements between dividers
  function wrapElementsBetweenDividers() {
    console.log('Running wrapElementsBetweenDividers...');
  
    // Select all <hr> dividers that define sections
    const dividerElements = Array.from(document.querySelectorAll('hr.notion-hr'));
  
    if (dividerElements.length < 4) return; // Ensure there are enough dividers
  
    const sectionsArray: Section[] = [];
  
    let index = 0;
    while (index <= dividerElements.length - 4) { // Process in groups of 4
      const firstDivider = dividerElements[index];
      const secondDivider = dividerElements[index + 1];
      const thirdDivider = dividerElements[index + 2];
      const fourthDivider = dividerElements[index + 3];
  
      const elementsToWrap: HTMLElement[] = [];
      let nextSibling = secondDivider.nextElementSibling;
  
    // Collect all elements until we reach the third <hr> divider
    while (nextSibling && nextSibling !== thirdDivider) {
      elementsToWrap.push(nextSibling as HTMLElement);
      nextSibling = nextSibling.nextElementSibling;
    }

  
      // If we found elements, wrap them in a div
      if (elementsToWrap.length > 0) {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('custom-divider-wrapper');
        elementsToWrap.forEach((element) => wrapperDiv.appendChild(element));
        // divider.insertAdjacentElement('afterend', wrapperDiv);
  
        // Extract multiple headings and their corresponding links
        const headingElements = Array.from(wrapperDiv.querySelectorAll('h3.notion-h2'));
  
        headingElements.forEach((headingElement) => {
          const headingText = headingElement.textContent?.trim() || 'Untitled Section';
  
          const links: { text: string; href: string }[] = [];
          let nextSibling = headingElement.nextElementSibling;
  
          // Collect links under the heading until another heading or <hr> is found
          while (nextSibling && !nextSibling.matches('h3.notion-h2') && !nextSibling.matches('hr.notion-hr')) {
            const linkElements = nextSibling.querySelectorAll('a.notion-link');
            linkElements.forEach((link) => {
              links.push({
                text: link.textContent?.trim() || 'Unnamed Link',
                href: link.getAttribute('href') || '#',
              });
            });
  
            nextSibling = nextSibling.nextElementSibling;
          }
  
          // Add this section to the array if it has links
          if (links.length > 0) {
            sectionsArray.push({ heading: headingText, links });
          }
        });
      }


    // Remove all four <hr> elements
    firstDivider.remove();
    secondDivider.remove();
    thirdDivider.remove();
    fourthDivider.remove();
  
      // Move to the next <hr> divider
      index += 4;
    }
  
    console.log('Extracted sections:', sectionsArray);
    setSections(sectionsArray); // Update state
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

    // Header
    const header = document.querySelector('.breadcrumbs')
    if (header) {
      const nav = document.createElement('nav')
      nav.classList.add('nav-container') // Optionally add a class to the <nav> tag for styling

      const links = [
        { href: '/', label: 'Coursetexts' },
        { href: '/about', label: 'About' },
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

    //
    function removeNotionLinkWithText() {
      // Select all anchor tags with the class 'notion-link'
      const anchorTags = document.querySelectorAll('a.notion-link')

      // Define the target texts to match
      const targetTexts = ['Privacy Policy', 'Terms of Service', 'About']

      // Iterate over all anchor tags
      anchorTags.forEach((anchor) => {
        // Check if the anchor's text content matches any of the target texts
        if (targetTexts.includes(anchor.textContent.trim())) {
          // Remove the parent container of the anchor tag
          const parentContainer = anchor.closest('.notion-text') // Adjust the selector if needed
          if (parentContainer) {
            parentContainer.remove()
          }
        }
      })
    }



    //
    function addContainerAtEndOfArticle(
      articleSelector,
      containerClassName,
      content = ''
    ) {
      // Select the article element
      const articleElement = document.querySelector(articleSelector)

      if (articleElement) {
        // Create a new div container
        const newContainer = document.createElement('div')
        newContainer.className = containerClassName // Assign a custom class
        newContainer.innerHTML = content // Set the inner content

        // Append the new container as the last child of the article
        articleElement.appendChild(newContainer)
      } else {
        console.warn(
          `Article element with selector "${articleSelector}" not found.`
        )
      }
    }

    // Execute the function to wrap elements
    if (router.pathname === '/'  ) {
      //
      wrapElementsBetweenBlanks()
      // Select all elements with the 'notion-page-link' class
      const notionPageLinks = document.querySelectorAll('.notion-page-link')
      // Loop through all the selected elements and replace the class with 'notion-link'
      notionPageLinks.forEach((element) => {
        element.classList.remove('notion-page-link')
        element.classList.add('notion-link')
      })
      const details1Elements =
        document.querySelectorAll<HTMLElement>('.notion-link')
      details1Elements.forEach((element) => {
        element.style.borderBottom = 'none' // Removing the border bottom for each element
      })
      // Select all elements with the 'notion-title' class on h1 tags
      const titleElements = document.querySelectorAll('h1.notion-title')

      titleElements.forEach((element) => {
        // Remove 'notion-title' class
        element.classList.add('notion-home-title')
      })
      addContainerAtEndOfArticle(
        'article',
        'custom-footer-container',
        `
        <p>A free and open archive of Harvard & MIT course materials</p>

        <div class="footer-links">
          <a href="https://hcb.hackclub.com/donations/start/coursetexts" target='_blank' class="footer-link">Donate</a>
          <a href="/privacy-policy" class="footer-link">Privacy Policy</a>
          <a href="/terms-of-service" class="footer-link">Terms of Service</a>
         </div>
         `
      )
      removeNotionLinkWithText()
      //
      const customWrappers = document.querySelectorAll('.custom-wrapper-class, .custom-divider-wrapper')
      customWrappers.forEach((wrapper) => {
        if (wrapper.children.length === 0) {
          wrapper.remove()
        }
      })
      // Select all elements with the class 'notion-link'
      const notionLinks = document.querySelectorAll('.notion-link')
      console.log('notionLinks', notionLinks)

      // Iterate through each notion-link
      notionLinks.forEach((notionLink) => {
        // Check if the parent of the notion-link has the 'custom-wrapper-class'
        const parentWrapper = notionLink.closest('.custom-wrapper-class, .custom-divider-wrapper')

        if (parentWrapper) {
          // Clean up the page title text if it exists
          const pageTitleText = notionLink.querySelector('.notion-page-title-text')
          if (pageTitleText) {
            pageTitleText.textContent = pageTitleText.textContent
              .replace(/[_.]/g, ' ')  // Replace underscores and dots with spaces
              .trim()  // Remove extra whitespace
          }

          // Check if the element is already wrapped with the 'notion-text' class
          if (!notionLink.parentElement.classList.contains('notion-text')) {
            // Create a new div with the class 'notion-text'
            const wrapperDiv = document.createElement('div')
            wrapperDiv.className = 'notion-text'

            // Insert the wrapper div before the notion-link in the DOM
            notionLink.parentNode.insertBefore(wrapperDiv, notionLink)

            // Move the notion-link inside the wrapper div
            wrapperDiv.appendChild(notionLink)
          }
        }
      })

      const removeNearestContainersForLink = (linkHref: string) => {
        document.querySelectorAll(`a[href="${linkHref}"]`).forEach((link) => {
          let container = link.closest('div') as HTMLElement // Find the nearest container (first parent div)
          let count = 0 // Track how many containers are removed

          while (container && count < 2) {
            const parent = container.parentElement // Get the parent container
            container.remove() // Remove the current container
            container = parent // Move to the next parent container
            count++ // Increment the counter
          }
        })
      }

      removeNearestContainersForLink(
        'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en'
      )
    } else if (router.asPath === '/about-9a2ace4be0dc4d928e7d304a44a6afe8') {
      wrapHeadersAndContent()
    } else if (
      router.asPath === '/about' ||
      pageId == '2636f19a-6ceb-4d8d-b057-f0b166b05ce0' ||
      (router.asPath.split('/')[1]?.startsWith('about') &&
        router.asPath.split('/')[1])
    ) {
      
      const titleElements =
        document.querySelectorAll<HTMLElement>('h1.notion-title')

      titleElements.forEach((element) => {
        // Add 'notion-about-title' class to the h1 element
        element.classList.add('notion-about-title')

        // Hide the 'notion-title' elements by setting display to 'none'
        element.style.display = 'none'
      })

      //
      const summaryElements = document.querySelectorAll('summary')

      summaryElements.forEach((summaryElement) => {
        // Get the text content from the <summary> element
        const textContent = summaryElement.textContent

        // Replace the inner HTML with only the text content
        summaryElement.innerHTML = textContent
      })
    } else {
      //
      
      wrapElementsBetweenDividers()
      
      document.querySelectorAll('.notion-title').forEach(function (summary) {
        // Select the <b> tag inside the <summary>
        const boldTag = summary.querySelector('b')

        // If a <b> tag exists, replace it with its text content
        if (boldTag) {
          boldTag.replaceWith(boldTag.textContent)
        }
      })
      const customWrappers = document.querySelectorAll('.notion-text')
      customWrappers.forEach((wrapper) => {
        if (
          wrapper.children.length === 0 &&
          wrapper.textContent.trim() === ''
        ) {
          wrapper.remove()
        }
      })
      // // Find the parent container with the class 'notion-page-content-inner'
      // const notionPageContentInner = document.querySelector(
      //   '.notion-page-content-inner'
      // )


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
        detailsElement.style.paddingBottom = '8px'
        detailsElement.style.borderBottom = '1px solid hsl(214.3, 31.8%, 91.4%)'
      })
    }

    if (
      router.asPath === '/about-9a2ace4be0dc4d928e7d304a44a6afe8' ||
      router.asPath === '/about' ||
      pageId == '2636f19a-6ceb-4d8d-b057-f0b166b05ce0' ||
      (router.asPath.split('/')[1]?.startsWith('about') &&
        router.asPath.split('/')[1])
    ) {
      setDropdownOpen()
      addSeeAllClassesButton()
      const notionTextElements = document.querySelectorAll('.notion-text') // Select all elements with class 'notion-text'
      notionTextElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          // Ensure the element is an HTMLElement
          element.style.setProperty('padding', '0', 'important') // Apply padding with !important
          element.style.setProperty('margin', '0', 'important') // Apply margin with !important
        }
      })
      // Get the notion-app element
      const notionApp = document.querySelector('.notion-app')

      // Get the button-container element
      const buttonContainer = document.querySelector('.button-container')

      // Check if both elements exist
      if (notionApp && buttonContainer) {
        // Move the button-container inside the notion-app
        notionApp.appendChild(buttonContainer)
      }
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

  // const pageAside = React.useMemo(
  //   () => (
  //     <PageAside block={block} recordMap={recordMap} isBlogPost={isBlogPost} />
  //   ),
  //   [block, recordMap, isBlogPost]
  // )

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


  console.log(sections)


  



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

      {/* {isLiteMode && <BodyClassName className='notion-lite' />}
      {isDarkMode && <BodyClassName className='dark-mode' />} */}
      <BodyClassName className={pageClass} />

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


      {/* { (router.asPath != '/about' && router.asPath != '/') && 
    
      <ContentTable sections={sections} />
      } */}

      {(router.asPath === '/about-9a2ace4be0dc4d928e7d304a44a6afe8' ||
        router.asPath === '/about' ||
        (router.asPath.split('/')[1]?.startsWith('about') &&
          router.asPath.split('/')[1]) ||
        pageId == '2636f19a-6ceb-4d8d-b057-f0b166b05ce0') && (
        <div className='button-container'>
          <a href='./'><button className='see-all'>See All Classes →</button></a>
          <a href='https://hcb.hackclub.com/donations/start/coursetexts' target='_blank' rel="noreferrer" ><button className='see-all'>Donate →</button></a>
        </div>
      )}

      {( router.asPath === '/why' ) && (
        <div className='button-container'>
          <a href='https://hcb.hackclub.com/donations/start/coursetexts' target='_blank' rel="noreferrer" ><button className='see-all'>Donate →</button></a>
        </div>
      )}

      
      {/* <GitHubShareButton /> */}
    </>
  )
}


