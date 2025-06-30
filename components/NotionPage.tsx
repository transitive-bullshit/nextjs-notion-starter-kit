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

import { createRoot, Root} from 'react-dom/client'  // React 18+
import FilterRow from './FilterRow'
import { UpdateNoticeBanner } from './UpdateNoticeBanner'
// import { HeroButterflies } from './HeroButterflies'
import FeedbackForm from './FeedbackForm'
import { LINK_ICON_METADATA, LinkIconKey } from '@/lib/link-icons'
import { donate } from '@/lib/config'


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

// type Section = {
//   heading: string;
//   links: { text: string; href: string }[];
// };


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
    <div style={{ paddingTop:'2rem',margin:'auto', fontFamily:'DM Mono', color:'#374151'}}>
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


// Helper function to insert a React component after the Notion callout:
function addReactComponentAfterHeader(reactNode: React.ReactNode) {
  // Select the first notion-callout div
  const notionCallout = document.querySelector('.notion-header')

  if (notionCallout) {
    // Create a new container for our React component
    const newContainer = document.createElement('div')
    newContainer.className = 'fill-article-row'

    // Insert the container right after the callout
    notionCallout.insertAdjacentElement('afterend', newContainer) // also try beforebegin

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

  // const [sections, setSections] = React.useState([]) // state for sections to be used for tabs

  // Change departments array to single department string
  const [searchValue, setSearchValue] = React.useState('')
  const [department, setDepartment] = React.useState<string>('')  // Changed from departments array
  const [allDepartmentTags, setAllDepartmentTags] = React.useState<string[]>([]);





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


  const filterRootRef = React.useRef<{root: Root | null, container: HTMLElement | null}>({
    root: null,
    container: null
  });


  // Clean up when the component unmounts or pageClass changes
  React.useEffect(() => {
    // First, clean up any existing root when the page type changes
    if (filterRootRef.current.root) {
      try {
        filterRootRef.current.root.unmount();
        filterRootRef.current.root = null;
      } catch (e) {
        console.error("Error unmounting filter root:", e);
      }

      // Remove container if it exists
      if (filterRootRef.current.container && filterRootRef.current.container.parentNode) {
        console.log('removing container', filterRootRef.current.container)
        filterRootRef.current.container.remove();
      }
      filterRootRef.current.container = null;
    }

    // Only create the container and root on the home page
    if (pageClass === "notion-home") {
      // Look for a good container to place the filter row
      const notionCallout = document.querySelector('.notion-callout');
      if (notionCallout) {
        // Insert a container for FilterRow
        const newContainer = document.createElement('div');
        newContainer.className = 'fill-article-row filter-row-container';

        // Insert it in the DOM
        notionCallout.insertAdjacentElement('beforebegin', newContainer);

        // Store the container reference
        filterRootRef.current.container = newContainer;

        // Create and store the React root
        const newRoot = createRoot(newContainer);
        filterRootRef.current.root = newRoot;

        // Render the FilterRow component immediately
        newRoot.render(
          <FilterRow
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            department={department}
            setDepartment={setDepartment}
            allDepartmentTags={allDepartmentTags}
          />
        );
      }
    }

    // Cleanup function when component unmounts
    return () => {
      // Use requestAnimationFrame to ensure we're not unmounting during render
      requestAnimationFrame(() => {
        if (filterRootRef.current.root) {
          try {
            filterRootRef.current.root.unmount();
          } catch (e) {
            console.error("Error unmounting filter root:", e);
          }
          filterRootRef.current.root = null;
        }

        if (filterRootRef.current.container) {
          filterRootRef.current.container = null;
        }
      });
    };
  }, [pageClass]); // Only depend on pageClass




  // Update the FilterRow rendering
  React.useEffect(() => {
    if (filterRootRef.current.root) {
      filterRootRef.current.root.render(
        <FilterRow
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          department={department}
          setDepartment={setDepartment}
          allDepartmentTags={allDepartmentTags}
        />
      );
    }
  }, [searchValue, department, allDepartmentTags]);

  React.useEffect(() => {
    if (pageClass=='notion-home') {
    addReactComponentAtEndOfArticle (
      'article',
      'fill-article-row',
      <License/>
    )
    }
  }, [pageClass])

  React.useEffect(() => {
      if (pageClass=='course-page') {
      addReactComponentAtEndOfArticle (
        'article',
        'fill-article-row',
        <FeedbackForm courseName={title}/>
      )
      addReactComponentAtEndOfArticle (
        'article',
        'fill-article-row',
        <License/>
      )
    }
  }, [pageClass])

  React.useEffect(() => {
    // Once the Notion content is rendered on client side,
    // you can insert your React component:
    if (pageClass == 'course-page') {

    addReactComponentBeforeTitle(
      <a href="/" style={{ textDecoration: 'none' }}>
      <button style={{
        background: 'none',
        border: 'none',
        color: '#58534A', // Gray color
        fontSize: '14px',
        fontWeight: '500',
        fontFamily: 'Tobias',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        marginBottom: '1.5rem',
        padding: 0,
      }}>

        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="12" viewBox="0 0 9 15" fill="none" style={{ marginRight: '10px' }}>
          <path d="M7.5 14L1.25 7.75L7.5 1.5" stroke="#B2A371" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Archive
      </button>
      </a>
      )
    }


    addReactComponentAfterHeader(
      <UpdateNoticeBanner/>
    )

  }, [pageClass])

  // 2) Filter .custom-wrapper-class i.e. the course cards each time searchValue or department changes
  React.useEffect(() => {
    if (pageClass === "notion-home") {
      const cards = document.querySelectorAll('.custom-wrapper-class');

      cards.forEach((card) => {
        const cardText = card.textContent.toLowerCase();
        const matchesSearch = cardText.includes(searchValue.toLowerCase());

        const subjectContent = card.querySelector('a.notion-link')?.textContent?.toLowerCase().match(/\(([^)]+)\)/)?.[1] || '';
        const matchesDepartment = !department || subjectContent.includes(department.toLowerCase());

        // Use both classList and style to ensure proper hiding
        if (matchesSearch && matchesDepartment) {
          (card as HTMLElement).style.display = 'block';
          card.classList.remove('hidden');
        } else {
          (card as HTMLElement).style.display = 'none';
          card.classList.add('hidden');
        }
      });
    }
  }, [searchValue, department, pageClass]);





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

          // AFTER inserting into DOM, find the notion-link inside this specific wrapper
          const notionLink = wrapperDiv.querySelector('a')
          console.log(notionLink)
          if (notionLink) {
            const linkUrl = notionLink.getAttribute('href')
            if (linkUrl) {
              wrapperDiv.style.cursor = 'pointer'
              wrapperDiv.addEventListener('click', () => {
                  window.location.href = linkUrl
              })
            }
          }

          // Since we inserted a wrapper, the next .notion-blank should be skipped
          index += 1
        } else {
          // Otherwise, move to the next .notion-blank
          index += 1
        }
      }
    }


function wrapElementsBetweenDividers(): void {
  const headingSelector =
    'h1[class*="notion-"], h2[class*="notion-"], h3[class*="notion-"]';
  const isHeading = (el: Element | null): el is HTMLElement =>
    !!el && el.matches(headingSelector);

  /* ---------- 1 · find the delimiting <hr> ---------------------------- */
  const dividers = Array.from(document.querySelectorAll('hr.notion-hr'));
  if (dividers.length < 4) return;         // page layout must have changed
  const startDivider = dividers[1];        // 2nd <hr>
  const endDivider   = dividers[2];        // 3rd <hr>

  /* ---------- 2 · build the three shells ----------------------------- */
  const gridWrapper  = document.createElement('div');
  gridWrapper.className = 'content-table';

  /* ✨ NEW: the heading element */
  const tableHeading = document.createElement('h1');
  tableHeading.textContent = 'Course Materials';
  tableHeading.className   = 'content-table-heading';

  const tabsBlock    = document.createElement('div');
  tabsBlock.className = 'content-table-tabs';

  const restBlock    = document.createElement('div');
  restBlock.className = 'content-table-rest';

  /* ---------- 3 · tab-bar + panel container -------------------------- */
  const tabBar        = document.createElement('div');
  tabBar.className    = 'custom-divider-tabbar';

  const panelContainer = document.createElement('div');   // holds the panels
  tabsBlock.append(tabBar, panelContainer);               // keep them together

  /* ---------- 4 · walk through the nodes between the two <hr> -------- */
  let node: Element | null = startDivider.nextElementSibling;
  let tabIndex = 0;

  while (node && node !== endDivider) {
    if (isHeading(node)) {
      /* ----- create a new tab-panel ---------------------------------- */
      const afterHeading = node.nextElementSibling;

      const wrapper = document.createElement('div');
      wrapper.className = 'custom-divider-wrapper-tabcontent';
      wrapper.dataset.tab = String(tabIndex);
      if (tabIndex !== 0) wrapper.style.display = 'none';

      wrapper.appendChild(node);                       // move the heading in

      /* swallow everything until next heading or the end divider ----- */
      let sib = afterHeading;
      while (sib && !isHeading(sib) && sib !== endDivider) {
        const nxt = sib.nextElementSibling;
        wrapper.appendChild(sib);
        sib = nxt;
      }
      panelContainer.appendChild(wrapper);

      /* ----- matching tab button ------------------------------------ */
      const btn = document.createElement('button');
      btn.className = tabIndex === 0 ? 'tab-btn active' : 'tab-btn';
      btn.textContent = node.textContent?.trim() || `Tab ${tabIndex + 1}`;
      btn.addEventListener('click', () => {
        /* hide all panels + deactivate all buttons */
        panelContainer
          .querySelectorAll<HTMLElement>('.custom-divider-wrapper-tabcontent')
          .forEach(p => (p.style.display = 'none'));
        tabBar
          .querySelectorAll<HTMLButtonElement>('.tab-btn')
          .forEach(b => b.classList.remove('active'));

        /* show selected */
        wrapper.style.display = '';
        btn.classList.add('active');
      });
      tabBar.appendChild(btn);

      node = sib;
      tabIndex += 1;
    } else {
      /* anything that isn't part of a section -> shove into restBlock */
      const nxt = node.nextElementSibling;
      restBlock.appendChild(node);
      node = nxt;
    }
  }

  /* ---------- 5 · compose & inject into the DOM ---------------------- */
  gridWrapper.append(tableHeading, tabsBlock, restBlock);
  startDivider.parentElement?.insertBefore(gridWrapper, startDivider.nextSibling);

  /* ---------- 6 · clean up delimiters -------------------------------- */
  dividers.forEach(d => d.remove());
}






// Adds Icon SVGs to links!
React.useEffect(() => {
  // Add a small delay to ensure DOM is ready
  const timeoutId = setTimeout(() => {
    const page = document.querySelector('.course-page');
    if (!page) return;

    const notionLinks = page.querySelectorAll('.notion-link');
    if (!notionLinks?.length) return;

    notionLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      
      // If the link is already processed (has an svg), skip
      if (link.querySelector('svg')) return;

      const isProf = !!link.closest('.notion-blue'); // Checks if the link is blue for the profs sites

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('width', '20');
      svg.setAttribute('height', '20');
      svg.setAttribute('fill', 'none');
      
      svg.style.marginRight = '6px'; // Space between icon and text link
      svg.style.verticalAlign = 'middle';

      // Circular icon background
      svg.style.background = '#E5E1D3';
      svg.style.borderRadius = '100%';
      svg.style.padding = '4px';

      let iconKey: LinkIconKey = "DEFAULT";
      let viewBoxWidth = 16;
      let viewBoxHeight = 16;

      if (isProf) {
        iconKey = "PROF";
        // Prof icon is designed to be 12x12
        viewBoxWidth = 12;
        viewBoxHeight = 12;
      } else if (href.startsWith("https://storage.googleapis.com")) {
        iconKey = "BOOK";
      } else if (href.startsWith("https://youtu.be")) {
        iconKey = "PLAY";
      }
      
      const customIconPath = LINK_ICON_METADATA[iconKey].path;
      svg.setAttribute("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
      
      // Add all of the icon's paths directly to the SVG
      customIconPath.forEach((d) => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d); // Use the pre-transformed path
        path.setAttribute("fill", "#111928");
        svg.appendChild(path);
      });
      
      // Insert the SVG before the link's first child
      link.insertBefore(svg, link.firstChild);
    });
  }, 200); // Small delay to ensure DOM is ready

  return () => clearTimeout(timeoutId);
}, [router]);




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
        // { href: '/about', label: 'About' },
        { href: '/why', label: 'Why' },
        { href: donate, label: 'Donate', target: '_blank', rel: 'noreferrer' },

      ];

      links.forEach((link, index) => {
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.classList.add('nav-link'); // Add styling class to <a> tag

        // Apply target and rel attributes if they exist
        if (link.target) {
          anchor.target = link.target;
        }
        if (link.rel) {
          anchor.rel = link.rel;
        }

        // Apply flexbox to align vertically
        anchor.style.display = 'flex';
        anchor.style.flexDirection = 'row'; // Stack SVG and text vertically
        anchor.style.alignItems = 'center'; // Center align items
        anchor.style.textDecoration = 'none'; // Remove underline
        anchor.style.color = 'black'; // Set text color
        anchor.style.gap = '4px'; // Space between SVG and text

        // If it's the first link, insert the SVG
        if (index === 0) {
          const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          svgIcon.setAttribute('width', '24');
          svgIcon.setAttribute('height', '25');
          svgIcon.setAttribute('viewBox', '0 0 24 25');
          svgIcon.setAttribute('fill', 'none');

          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', 'M21.9 18.8375L18.0187 4.34375C17.9155 3.95963 17.6639 3.63225 17.3194 3.43358C16.9748 3.23492 16.5654 3.18125 16.1813 3.28438L13.2844 4.0625L13.1906 4.09062C13.0509 3.90732 12.8708 3.75868 12.6643 3.65625C12.4578 3.55382 12.2305 3.50035 12 3.5H9C8.73609 3.50071 8.47716 3.57191 8.25 3.70625C8.02284 3.57191 7.76391 3.50071 7.5 3.5H4.5C4.10218 3.5 3.72064 3.65804 3.43934 3.93934C3.15804 4.22064 3 4.60218 3 5V20C3 20.3978 3.15804 20.7794 3.43934 21.0607C3.72064 21.342 4.10218 21.5 4.5 21.5H7.5C7.76391 21.4993 8.02284 21.4281 8.25 21.2938C8.47716 21.4281 8.73609 21.4993 9 21.5H12C12.3978 21.5 12.7794 21.342 13.0607 21.0607C13.342 20.7794 13.5 20.3978 13.5 20V10.6625L16.1063 20.3844C16.1912 20.7047 16.3798 20.988 16.6427 21.1898C16.9056 21.3916 17.2279 21.5007 17.5594 21.5C17.6888 21.4978 17.8176 21.482 17.9437 21.4531L20.8406 20.675C21.2247 20.5718 21.5521 20.3202 21.7508 19.9756C21.9495 19.631 22.0031 19.2216 21.9 18.8375ZM16.5656 4.7375L17.1562 6.90313L14.2594 7.68125L13.6688 5.51563L16.5656 4.7375ZM12 5V16.25H9V5H12ZM7.5 5V7.25H4.5V5H7.5ZM12 20H9V17.75H12V20ZM20.4562 19.2219L17.5594 20L16.9688 17.825L19.875 17.0469L20.4562 19.2219Z');
          path.setAttribute('fill', 'black');

          svgIcon.appendChild(path);
          anchor.appendChild(svgIcon); // Append SVG before text
        }

        const textNode = document.createTextNode(link.label);
        anchor.appendChild(textNode);

        nav.appendChild(anchor); // Append each <a> to the <nav>
      });

      header.appendChild(nav); // Append <nav> to the .notion-nav-header

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
            console.log('removing container for anchor', parentContainer)
            parentContainer.remove()
          }
        }
      })
    }




    // function addContainerAtEndOfArticle(
    //   articleSelector,
    //   containerClassName,
    //   content = ''
    // ) {
    //   // Select the article element
    //   const articleElement = document.querySelector(articleSelector)

    //   if (articleElement) {
    //     // Create a new div container
    //     const newContainer = document.createElement('div')
    //     newContainer.className = containerClassName // Assign a custom class
    //     newContainer.innerHTML = content // Set the inner content

    //     // Append the new container as the last child of the article
    //     articleElement.appendChild(newContainer)
    //   } else {
    //     console.warn(
    //       `Article element with selector "${articleSelector}" not found.`
    //     )
    //   }
    // }

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
      // addContainerAtEndOfArticle(
      //   'article',
      //   'custom-footer-container',
      //   `
      //   <p>A free and open archive of Harvard & MIT course materials</p>

      //   <div class="footer-links">
      //     <a href="https://hcb.hackclub.com/donations/start/coursetexts" target='_blank' class="footer-link">Donate</a>
      //     <a href="/privacy-policy" class="footer-link">Privacy Policy</a>
      //     <a href="/terms-of-service" class="footer-link">Terms of Service</a>
      //    </div>
      //    `
      // )
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
          let container = link.closest('div, .notion-text') as HTMLElement // Find the nearest container (first parent div)
          let count = 0 // Track how many containers are removed

          while (container && count < 2) {
            const parent = container.parentElement // Get the parent container
            console.log('container being removed:', container.classList)
            if (container.classList.contains('notion-page-content-inner')) {
              break
            }
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
          console.log('wrapper being removed:', wrapper)
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

  React.useEffect(() => {
    // Select all custom wrapper elements i.e. all the course cards
    const customWrappers = document.querySelectorAll('.custom-wrapper-class');

    if (customWrappers.length === 0) return;

    // Check if the container already exists to prevent duplication
    let parentContainer = document.querySelector('.custom-wrapper-container');

    if (!parentContainer) {
      parentContainer = document.createElement('div');
      parentContainer.className = 'custom-wrapper-container';

      // Insert the container before the first custom wrapper
      customWrappers[0].parentNode.insertBefore(parentContainer, customWrappers[0]);
    }

    // Move all custom wrappers into the parent container
    customWrappers.forEach(wrapper => {
      // Only append if the wrapper is not already child of the parent container
      // Only append if new child element does not contain the parent container
      if (wrapper.parentNode !== parentContainer && !wrapper.contains(parentContainer)) {
        parentContainer.appendChild(wrapper);
      }
    });

    // Only generate department tags if we're on the home page and haven't set them yet
    if (pageClass === 'notion-home' && allDepartmentTags.length === 0) {
      const cards = document.querySelectorAll('.custom-wrapper-class');
      const departmentSet = new Set<string>();

      cards.forEach((card) => {
        // Grab the text inside the parentheses of the course card title
        const parenthesesContent = card.querySelector('a.notion-link')?.textContent?.match(/\(([^)]+)\)/)?.[1] || '';

        if (parenthesesContent) {
          // Extract department code (alphabetical prefix before any numbers)
          const departmentCode = parenthesesContent.trim().match(/^[A-Za-z]+/)?.[0] || '';

          // Only add if it's not empty
          if (departmentCode) {
            departmentSet.add(departmentCode.toUpperCase());
          }
        }
      });

      const extractedDepartments = Array.from(departmentSet).sort();

      if (extractedDepartments.length > 0) {
        setAllDepartmentTags(extractedDepartments);
      }
    }
  }, []); // Remove pageClass from dependencies to run only once on mount





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
      propertyDateValue,
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



// /* Run once per page load */
// React.useEffect(() => {
//   //  create an overlay container
//   const overlay = document.createElement('div');
//   overlay.className = 'butterfly-overlay pointer-events-none';
//   Object.assign(overlay.style, {
//     position: 'absolute',
//     inset: '0',            // top:0 right:0 bottom:0 left:0
//     zIndex: '10',          // above the block content
//     overflow: 'visible',
//   });

//   if (pageClass === "notion-home") {
//   const hero = document.querySelector(
//     '.notion-home .notion-block-1a519a13312a8036a624e4732734ce6a'
//   );

//   /* only if the hero exists and we haven't already added butterflies */
//   if (hero && !hero.querySelector('.butterfly-overlay')) {
//     // 1️⃣ make sure the block can act as the positioning context
//     (hero as HTMLElement).style.position ||= 'relative';
//     hero.appendChild(overlay);

//     // 3️⃣ mount React *into the overlay*, not the block itself
//     createRoot(overlay).render(<HeroButterflies />);
//   }
// } else {
//   // Find a general container to attach the overlay to
//   const container = document.querySelector('.notion-frame') || document.body;

//   // Avoid duplicate overlays
//   if (container && !container.querySelector('.butterfly-overlay')) {
//     (container as HTMLElement).style.position ||= 'relative';
//     container.appendChild(overlay);
//     createRoot(overlay).render(<HeroButterflies />);
//   }
// }

// }, [router, pageClass]);




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
      />

      {(router.asPath === '/about-9a2ace4be0dc4d928e7d304a44a6afe8' ||
        router.asPath === '/about' ||
        (router.asPath.split('/')[1]?.startsWith('about') &&
          router.asPath.split('/')[1]) ||
        pageId == '2636f19a-6ceb-4d8d-b057-f0b166b05ce0' ||  router.asPath === '/why')   && (
        <div className='button-container'>
          <a href='./'><button className='see-all'>See All Classes →</button></a>
          <a href={donate} target='_blank' rel="noreferrer" ><button className='see-all'>Donate →</button></a>
        </div>
      )}


      <Footer/>
      {/* <GitHubShareButton /> */}
    </>
  )
}


