import React from 'react'
import styles from './ContentTable.module.css' // Import the CSS file
// import { Download } from 'react-feather' // Import an icon for download

interface LinkItem {
  text: string
  href: string
}

interface Section {
  heading: string
  links: LinkItem[]
}

interface Props {
  sections: Section[]
}

// Download icon as an SVG component
const DownloadIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.downloadIcon}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
  

export default function ContentTable({ sections }: Props) {
  const [activeTab, setActiveTab] = React.useState(0)

  return (
    <div className={styles.contentTable}>
      {/* The tab buttons */}
      <div className={styles.tabButtons}>
        {sections.map((section, idx) => (
          <button
            key={idx}
            className={idx === activeTab ? `${styles.tab} ${styles.active}` : styles.tab}
            onClick={() => setActiveTab(idx)}
          >
            {section.heading}
          </button>
        ))}
      </div>

      {/* The tab content = list of links */}
      <div className={styles.tabContent}>
        {sections[activeTab]?.links?.length ? (
          <ul>
            {sections[activeTab].links.map((linkItem, linkIdx) => (
              <li key={linkIdx}>
                <a href={linkItem.href} target='_blank' rel="noreferrer">
                  {linkItem.text}
                  {/* <span className={styles.fileInfo}>PDF · 243KB</span>  */}
                </a>
                <DownloadIcon /> 
              </li>
            ))}
          </ul>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  )
}
