import React from 'react';

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
          >
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.91.91l.27.28v.79l5 4.99 1.49-1.49-4.99-5zm-6 0a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
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

