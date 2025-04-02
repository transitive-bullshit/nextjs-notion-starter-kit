import React from 'react';
import { UpdateNotice } from './UpdateNotice';

interface FilterRowProps {
  searchValue: string;
  setSearchValue: (val: string) => void;
  department: string;
  setDepartment: (val: string) => void;
}

const FilterRow: React.FC<FilterRowProps> = ({
  searchValue,
  setSearchValue,
  department,
  setDepartment
}) => {
  const departments = [
    'Harvard',
    'MIT',
    'Stanford',
    'Math',
    'Computer Science',
    'Astronomy',
    'Eng',
    'Science',
    // Add extras to demonstrate scrolling
    'Science',
    'Science',
    'Science',
    'Science',
    'Science',
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div style={styles.container}>
      {/* Search Bar on its own row */}
      <div style={styles.searchContainer}>
        <div style={styles.iconWrapper}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M13.75 9.0625C13.75 9.9896 13.4751 10.8959 12.96 11.6667C12.4449 12.4376 11.7129 13.0384 10.8563 13.3932C9.9998 13.748 9.0573 13.8408 8.14801 13.6599C7.23873 13.4791 6.40349 13.0326 5.74794 12.3771C5.09238 11.7215 4.64594 10.8863 4.46507 9.97698C4.2842 9.0677 4.37703 8.1252 4.73181 7.26867C5.0866 6.41214 5.68741 5.68005 6.45826 5.16499C7.22912 4.64992 8.1354 4.375 9.0625 4.375C10.3057 4.375 11.498 4.86886 12.3771 5.74794C13.2561 6.62701 13.75 7.8193 13.75 9.0625ZM17.9375 17.9453C17.8208 18.0602 17.6637 18.1247 17.5 18.125C17.334 18.1243 17.1747 18.06 17.0547 17.9453L13.6797 14.5625C12.2583 15.7564 10.4308 16.3555 8.57844 16.2348C6.72607 16.114 4.99182 15.2828 3.73738 13.9146C2.48294 12.5463 1.80518 10.7465 1.84545 8.89063C1.88571 7.03477 2.6409 5.2661 3.9535 3.9535C5.2661 2.6409 7.03477 1.88571 8.89063 1.84545C10.7465 1.80518 12.5463 2.48294 13.9146 3.73738C15.2828 4.99182 16.114 6.72607 16.2348 8.57844C16.3555 10.4308 15.7564 12.2583 14.5625 13.6797L17.9375 17.0547C17.9966 17.1128 18.0434 17.1822 18.0755 17.2586C18.1075 17.3351 18.124 17.4171 18.124 17.5C18.124 17.5829 18.1075 17.6649 18.0755 17.7414C18.0434 17.8178 17.9966 17.8872 17.9375 17.9453ZM9.0625 15C10.2368 15 11.3848 14.6518 12.3612 13.9993C13.3376 13.3469 14.0986 12.4196 14.548 11.3347C14.9974 10.2497 15.115 9.05591 14.8859 7.90415C14.6568 6.75239 14.0913 5.69443 13.2609 4.86405C12.4306 4.03368 11.3726 3.46819 10.2208 3.23909C9.06909 3.00999 7.87525 3.12757 6.79032 3.57696C5.70538 4.02636 4.77807 4.78738 4.12565 5.7638C3.47323 6.74022 3.125 7.88817 3.125 9.0625C3.12707 10.6366 3.75329 12.1456 4.86634 13.2587C5.97938 14.3717 7.48841 14.9979 9.0625 15Z" fill="#111928"/>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search Course Materials"
          value={searchValue}
          onChange={handleSearchChange}
          style={styles.searchInput}
        />
      </div>

      {/* Filter Buttons with horizontal scroll, 
          pinned to the parent width */}
      <div style={styles.filtersOuter}>
        <div style={styles.filtersContainer}>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartment(department === dept ? "" : dept)}
              style={{
                ...styles.filterButton,
                ...(department === dept ? styles.activeFilterButton : {}),
              }}
            >
              {dept}
            </button>
          ))}
        </div>
        {/* Fades on each side */}
        <div style={styles.fadeLeft} />
        <div style={styles.fadeRight} />
      </div>

      <UpdateNotice/>
    </div>
  );
};

export default FilterRow;

// Inline styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    fontFamily: "'DM Mono', monospace",
    width: '100%',
  },

  // Search bar
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    border: '1px solid #E5E1D3',
    borderRadius: '8px', // pill shape
    padding: '1rem 1rem',
    width: '100%',
    maxWidth: '650px',
    justifySelf: 'center',
    margin: 'auto',
    boxSizing: 'border-box',
  },
  iconWrapper: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#E5E1D3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '0.5rem',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: 'transparent',
  },

  // Horizontal scroll row (with fade) pinned to parent width
  filtersOuter: {
    position: 'relative',
    width: '100%',
    maxWidth: '650px',
    margin:'auto',
    overflow: 'hidden', // ensures we don’t exceed parent & fade edges are visible
  
  },
  filtersContainer: {
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '8px',
    overflowX: 'auto',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    scrollBehavior: 'smooth',
    boxSizing: 'border-box',
    padding: '4px 0',
    WebkitOverflowScrolling: 'touch',

    /* Hide scrollbar in WebKit-based browsers (Chrome, Safari) */
    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,1))',
    maskImage: 'linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,1))',
  
    /* Hide scrollbar for Firefox */
    scrollbarWidth: 'none',

    /* Hide scrollbar for Edge & Internet Explorer */
    msOverflowStyle: 'none',
  },


  // Buttons
  filterButton: {
    backgroundColor: '#F3F2ED',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s, color 0.2s',
    whiteSpace: 'nowrap',
    
    // fontFamily: 'UntitledSans'
  },
  activeFilterButton: {
    backgroundColor: '#000',
    color: '#fff',
  },

  // Left & right fade overlays
  fadeLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '40px',
    pointerEvents: 'none',
    background: 'linear-gradient(to right, #F7F7F5, rgba(255,255,255,0))',
  },

  fadeRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '40px',
    pointerEvents: 'none',
    background: 'linear-gradient(to left, #F7F7F5, rgba(255,255,255,0))',
  },
};

