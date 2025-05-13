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
import { HeroButterflies } from './HeroButterflies'
import FeedbackForm from './FeedbackForm'


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

  const [sections, setSections] = React.useState([]) // state for sections to be used for tabs

  // Lift the search and department states up here
  const [searchValue, setSearchValue] = React.useState('')
  const [departments, setDepartments] = React.useState<string[]>([])

  

  

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
      notionCallout.insertAdjacentElement('beforebegin', newContainer);
  
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
            departments={departments}
            setDepartments={setDepartments}
          />

        )
    }
    }, [searchValue, departments])

  



  React.useEffect(() => {
    if (pageClass=='notion-home') {
    addReactComponentAtEndOfArticle (
      'article',
      'fill-article-row',
      <License/>
    ) 
    }
  }, [router])

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
  }, [router])

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
          <path d="M7.5 14L1.25 7.75L7.5 1.5" stroke="#B2A371" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back to Archive
      </button>
      </a>
      )
    }


    addReactComponentAfterHeader(
      <UpdateNoticeBanner/>
    )

  }, [router])


    // 2) Filter .custom-wrapper-class each time searchValue or department changes
    React.useEffect(() => {
      if (pageClass === "notion-home") {
        const customWrappers = document.querySelectorAll('.custom-wrapper-class');
    
        customWrappers.forEach((wrapper) => {
          const textContent = wrapper.textContent.toLowerCase();
          const matchesSearch = textContent.includes(searchValue.toLowerCase());
    
          const subjectContent = wrapper.querySelector('a.notion-link')?.textContent?.toLowerCase() || '';
          const schoolContent = wrapper.querySelector('span.notion-gray')?.textContent?.toLowerCase() || '';
    
          // Require ALL selected departments to be present in subject OR school content
          let matchesDepartment = true;
          if (departments.length > 0) {
            matchesDepartment = departments.every((dept) =>
              subjectContent.includes(dept.toLowerCase()) ||
              schoolContent.includes(dept.toLowerCase())
            );
          }
    
          if (matchesSearch && matchesDepartment) {
            (wrapper as HTMLElement).style.display = 'block';
          } else {
            (wrapper as HTMLElement).style.display = 'none';
          }
        });
      }
    }, [searchValue, departments]);
    



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
      /* anything that isn’t part of a section -> shove into restBlock */
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
  const page = document.querySelector('.course-page');
  if (!page) return;

  const notionLinks = page.querySelectorAll('.notion-link');
  
  notionLinks?.forEach((link) => {
    // Skip if SVG already added
    if (link.querySelector('svg')) return;

    const href = link.getAttribute('href') || '';
    const isProf = !!link.closest('.notion-blue'); // <-- this checks if the link is blue for the profs sites

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('fill', 'none');
    svg.style.marginRight = '6px';
    svg.style.background = '#E5E1D3';
    svg.style.borderRadius = '100%';
    svg.style.verticalAlign = 'middle'; 
    svg.style.padding = '4px'; 
    



    
  let customPaths = ["M11.1887 2.81104C10.9428 2.56346 10.6503 2.36697 10.3281 2.23289C10.0059 2.09881 9.6604 2.02979 9.31144 2.02979C8.96247 2.02979 8.61695 2.09881 8.29477 2.23289C7.97259 2.36697 7.68012 2.56346 7.43418 2.81104L6.42277 3.82245C6.35233 3.90019 6.31449 4.00204 6.31707 4.1069C6.31965 4.21177 6.36246 4.31163 6.43664 4.38581C6.51081 4.45998 6.61067 4.50279 6.71554 4.50538C6.82041 4.50796 6.92225 4.47011 6.99999 4.39968L8.01141 3.38826C8.35691 3.04482 8.82428 2.85205 9.31144 2.85205C9.7986 2.85205 10.266 3.04482 10.6115 3.38826C10.7828 3.55867 10.9187 3.76124 11.0114 3.98435C11.1042 4.20745 11.1519 4.44668 11.1519 4.68829C11.1519 4.9299 11.1042 5.16913 11.0114 5.39224C10.9187 5.61534 10.7828 5.81791 10.6115 5.98832L9.16586 7.43393C8.82035 7.77737 8.35298 7.97014 7.86583 7.97014C7.37867 7.97014 6.9113 7.77737 6.5658 7.43393C6.52862 7.39291 6.48351 7.35987 6.43318 7.33681C6.38285 7.31375 6.32836 7.30116 6.27302 7.29979C6.21768 7.29843 6.16264 7.30833 6.11124 7.32888C6.05983 7.34943 6.01315 7.38022 5.974 7.41936C5.93486 7.45851 5.90407 7.5052 5.88352 7.5566C5.86297 7.608 5.85307 7.66304 5.85443 7.71838C5.8558 7.77373 5.86839 7.82821 5.89145 7.87854C5.9145 7.92887 5.94755 7.97399 5.98857 8.01116C6.48663 8.50869 7.16183 8.78816 7.86583 8.78816C8.56982 8.78816 9.24502 8.50869 9.74308 8.01116L11.1887 6.56554C11.4363 6.31961 11.6328 6.02714 11.7668 5.70496C11.9009 5.38278 11.9699 5.03726 11.9699 4.68829C11.9699 4.33932 11.9009 3.9938 11.7668 3.67162C11.6328 3.34944 11.4363 3.05697 11.1887 2.81104Z", "M7.00001 9.5999L5.98859 10.6113C5.64134 10.944 5.17759 11.1274 4.69672 11.1223C4.21586 11.1171 3.75614 10.9238 3.4161 10.5838C3.07605 10.2437 2.88274 9.784 2.87759 9.30313C2.87244 8.82227 3.05585 8.35851 3.38853 8.01126L4.83415 6.56565C5.17965 6.22221 5.64702 6.02944 6.13418 6.02944C6.62134 6.02944 7.0887 6.22221 7.43421 6.56565C7.51194 6.63608 7.61379 6.67393 7.71866 6.67135C7.82353 6.66876 7.92339 6.62595 7.99756 6.55178C8.07174 6.4776 8.11455 6.37774 8.11713 6.27287C8.11971 6.16801 8.08187 6.06616 8.01143 5.98842C7.51337 5.49089 6.83817 5.21143 6.13418 5.21143C5.43019 5.21143 4.75499 5.49089 4.25692 5.98842L2.81131 7.43404C2.55142 7.6775 2.34314 7.97074 2.19886 8.29632C2.05457 8.62189 1.97723 8.97316 1.97142 9.32922C1.96562 9.68529 2.03147 10.0389 2.16506 10.369C2.29865 10.6991 2.49726 10.999 2.74907 11.2508C3.00088 11.5026 3.30075 11.7012 3.63086 11.8348C3.96097 11.9684 4.31457 12.0342 4.67063 12.0284C5.0267 12.0226 5.37796 11.9453 5.70354 11.801C6.02911 11.6567 6.32235 11.4484 6.56582 11.1885L7.57724 10.1771C7.64767 10.0994 7.68552 9.99755 7.68293 9.89268C7.68035 9.78781 7.63754 9.68795 7.56337 9.61377C7.48919 9.5396 7.38933 9.49679 7.28446 9.49421C7.17959 9.49162 7.07775 9.52947 7.00001 9.5999Z"]
  if (href.startsWith('https://storage.googleapis.com')) {
    customPaths = [ 'M11.0866 1.6875H4.13944C3.70632 1.68885 3.29134 1.8615 2.98508 2.16776C2.67882 2.47401 2.50617 2.889 2.50482 3.32212V11.9038C2.50482 12.0122 2.54788 12.1162 2.62451 12.1928C2.70115 12.2694 2.80509 12.3125 2.91348 12.3125H10.2692C10.3776 12.3125 10.4816 12.2694 10.5582 12.1928C10.6348 12.1162 10.6779 12.0122 10.6779 11.9038C10.6779 11.7955 10.6348 11.6915 10.5582 11.6149C10.4816 11.5382 10.3776 11.4952 10.2692 11.4952H3.32213C3.32213 11.2784 3.40824 11.0705 3.56151 10.9173C3.71479 10.764 3.92267 10.6779 4.13944 10.6779H11.0866C11.1949 10.6779 11.2989 10.6348 11.3755 10.5582C11.4522 10.4816 11.4952 10.3776 11.4952 10.2692V2.09615C11.4952 1.98777 11.4522 1.88383 11.3755 1.80719C11.2989 1.73055 11.1949 1.6875 11.0866 1.6875ZM9.86059 6.59135L8.5529 5.61058C8.51788 5.58324 8.47473 5.56839 8.4303 5.56839C8.38588 5.56839 8.34272 5.58324 8.30771 5.61058L7.00001 6.59135V2.50481H9.86059V6.59135Z'];
  } else if (href.startsWith('https://youtu.be')) {
    customPaths= ["M9.45191 5.16094V10.0648C9.45191 10.2816 9.3658 10.4894 9.21253 10.6427C9.05925 10.796 8.85137 10.8821 8.6346 10.8821H2.91345C2.64512 10.8821 2.37942 10.8292 2.13152 10.7266C1.88362 10.6239 1.65837 10.4734 1.46864 10.2836C1.08545 9.90045 0.870178 9.38074 0.870178 8.83883V3.93498C0.870178 3.71822 0.956287 3.51033 1.10956 3.35706C1.26284 3.20378 1.47072 3.11768 1.68749 3.11768H7.40864C7.95055 3.11768 8.47026 3.33295 8.85345 3.71614C9.23664 4.09932 9.45191 4.61904 9.45191 5.16094ZM12.9255 4.1955C12.8639 4.15806 12.7932 4.13826 12.7211 4.13826C12.6491 4.13826 12.5784 4.15806 12.5168 4.1955L10.4735 5.36016C10.4109 5.39634 10.3589 5.4485 10.323 5.51133C10.2871 5.57415 10.2686 5.64538 10.2692 5.71774V8.28204C10.2686 8.35439 10.2871 8.42562 10.323 8.48845C10.3589 8.55127 10.4109 8.60344 10.4735 8.63961L12.5168 9.80427C12.5791 9.84 12.6494 9.85933 12.7211 9.86046C12.793 9.86003 12.8635 9.84064 12.9255 9.80427C12.9881 9.76935 13.0401 9.71817 13.0761 9.65613C13.112 9.5941 13.1306 9.52351 13.1298 9.45181V4.54796C13.1306 4.47626 13.112 4.40568 13.0761 4.34364C13.0401 4.28161 12.9881 4.23043 12.9255 4.1955Z"];
  } 

  if (isProf) {
    customPaths =["M5.66707 7.72769C6.68667 7.72769 7.51321 6.90114 7.51321 5.88155C7.51321 4.86195 6.68667 4.0354 5.66707 4.0354C4.64747 4.0354 3.82092 4.86195 3.82092 5.88155C3.82092 6.90114 4.64747 7.72769 5.66707 7.72769Z","M5.66709 1.85376C4.80404 1.85376 3.96038 2.10968 3.24279 2.58916C2.5252 3.06864 1.9659 3.75015 1.63563 4.54749C1.30536 5.34484 1.21894 6.22222 1.38731 7.06868C1.55569 7.91514 1.97128 8.69266 2.58154 9.30292C3.19181 9.91318 3.96933 10.3288 4.81579 10.4971C5.66225 10.6655 6.53962 10.5791 7.33697 10.2488C8.13432 9.91856 8.81582 9.35927 9.2953 8.64167C9.77478 7.92408 10.0307 7.08042 10.0307 6.21738C10.0285 5.06076 9.56804 3.95214 8.75018 3.13428C7.93232 2.31643 6.82371 1.85598 5.66709 1.85376ZM8.42791 8.66772C8.1562 8.27796 7.80607 7.94926 7.39995 7.70268C6.93365 8.14941 6.31284 8.3988 5.66709 8.3988C5.02133 8.3988 4.40052 8.14941 3.93423 7.70268C3.5281 7.94926 3.17797 8.27796 2.90626 8.66772C2.43372 8.1356 2.12502 7.47826 2.01732 6.7748C1.90962 6.07135 2.0075 5.35176 2.29919 4.70264C2.59088 4.05351 3.06394 3.50251 3.66144 3.11594C4.25895 2.72938 4.95544 2.52372 5.66709 2.52372C6.37874 2.52372 7.07522 2.72938 7.67273 3.11594C8.27023 3.50251 8.74329 4.05351 9.03498 4.70264C9.32667 5.35176 9.42455 6.07135 9.31685 6.7748C9.20915 7.47826 8.90045 8.1356 8.42791 8.66772Z"]
    svg.setAttribute('viewBox', '0 0 12 12');
  }

  customPaths.forEach(d => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', '#111928'); 
    svg.appendChild(path);
  });

    link.insertBefore(svg, link.firstChild);
  });
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
        { href: 'https://hcb.hackclub.com/donations/start/coursetexts', label: 'Donate' },

      ];
      
      links.forEach((link, index) => {
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.classList.add('nav-link'); // Add styling class to <a> tag
      
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

  React.useEffect(() => {
    // Select all custom wrapper elements
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
      parentContainer.appendChild(wrapper);
    });
  }, []);

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


  console.log(sections)






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

//   /* only if the hero exists and we haven’t already added butterflies */
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
          <a href='https://hcb.hackclub.com/donations/start/coursetexts' target='_blank' rel="noreferrer" ><button className='see-all'>Donate →</button></a>
        </div>
      )}


      <Footer/>
      {/* <GitHubShareButton /> */}
    </>
  )
}


