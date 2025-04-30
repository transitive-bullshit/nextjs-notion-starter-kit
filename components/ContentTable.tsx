/**
 * ContentTable.tsx
 * ---------------------------------------------------------------------------
 * A small, self-contained tabbed UI that lets users switch between “sections.”
 * Each section shows a bulleted list of links, and every list item includes a
 * little SVG “download” icon.  Styling is handled by the accompanying
 * ContentTable.module.css file.
 */

import React from 'react';
import styles from './ContentTable.module.css';   // CSS-Modules stylesheet
// import { Download } from 'react-feather'       // Example of using an icon lib

/**
 * ---------------------------------------------------------------------------
 * Type helpers
 * ---------------------------------------------------------------------------
 */

/**
 * Single link inside a section
 *   • text – label shown to the user
 *   • href – absolute or relative URL that the <a> element points to
 */
interface LinkItem {
  text: string;
  href: string;
}

/**
 * A “tab” in the table:
 *   • heading – text that appears on the tab button itself
 *   • links   – array of LinkItem objects rendered when that tab is active
 */
interface Section {
  heading: string;
  links: LinkItem[];
}

/**
 * Props accepted by the <ContentTable/> root component
 */
interface Props {
  sections: Section[];     // All tabs to render
}

/**
 * ---------------------------------------------------------------------------
 * Presentational SVG component for a download arrow.
 * Wrapped in a React component so it can be styled with CSS Modules.
 * ---------------------------------------------------------------------------
 */
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
    {/* Tray at the bottom */}
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    {/* Arrow head */}
    <polyline points="7 10 12 15 17 10" />
    {/* Arrow shaft */}
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

/**
 * ---------------------------------------------------------------------------
 * ContentTable component
 * ---------------------------------------------------------------------------
 */
export default function ContentTable({ sections }: Props) {
  /** Index of the currently active tab (defaults to first tab) */
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className={styles.contentTable}>
      {/* ---------------------------------------------------------------
           Tab buttons
           ------------------------------------------------------------- */}
      <div className={styles.tabButtons}>
        {sections.map((section, idx) => (
          <button
            key={idx}
            className={
              idx === activeTab
                ? `${styles.tab} ${styles.active}` // Highlight current tab
                : styles.tab
            }
            onClick={() => setActiveTab(idx)}
          >
            {section.heading}
          </button>
        ))}
      </div>

      {/* ---------------------------------------------------------------
           Tab panel – list of links for the active section
           ------------------------------------------------------------- */}
      <div className={styles.tabContent}>
        {sections[activeTab]?.links?.length ? (
          <ul>
            {sections[activeTab].links.map((linkItem, linkIdx) => (
              <li key={linkIdx}>
                {/* Target blank opens in new tab; noreferrer for security */}
                <a href={linkItem.href} target="_blank" rel="noreferrer">
                  {linkItem.text}
                  {/* Example of extra file metadata that could be shown: */}
                  {/* <span className={styles.fileInfo}>PDF · 243 KB</span> */}
                </a>
                {/* Decorative / affordance icon */}
                <DownloadIcon />
              </li>
            ))}
          </ul>
        ) : (
          /* Fallback in case a section has no links */
          <p />   
          /* empty paragraph keeps layout stable; customise as needed */
        )}
      </div>
    </div>
  );
}
