import React, { useState } from 'react';



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
  // const [searchValue, setSearchValue] = useState('');
  // const [department, setDepartment] = useState('All Departments');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const selectDepartment = (dept: string) => {
    setDepartment(dept);
    setShowDropdown(false);
  };

  return (
    <div style={styles.container}>
      {/* Search bar with icon */}
      <div style={styles.searchContainer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="gray"
          style={styles.searchIcon}
        >
          <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.91.91l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
        </svg>
        <input
          type="text"
          placeholder="Search course materials..."
          value={searchValue}
          onChange={handleSearchChange}
          style={styles.searchInput}
        />
      </div>

      {/* Department toggle */}
      <div style={styles.departmentWrapper}>
        <button style={styles.departmentButton} onClick={toggleDropdown}>
          {department}
          <span style={styles.arrow}>▼</span>
        </button>

        {/* Dropdown menu */}
        {showDropdown && (
          <div style={styles.dropdown}>
            <button style={styles.dropdownItem} onClick={() => selectDepartment('All Departments')}>
              All Departments
            </button>
            <button style={styles.dropdownItem} onClick={() => selectDepartment('Department A')}>
              Department A
            </button>
            <button style={styles.dropdownItem} onClick={() => selectDepartment('Department B')}>
              Department B
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterRow;

// Inline styles with Full Width Support
const styles: { [key: string]: React.CSSProperties } = {
  container: {

    display: 'flex',
    alignItems: 'center',
    width: '100%', // Full width
    borderBottom: '1px solid #ccc',
    paddingBottom: '8px',
    marginBottom: '1rem',
    fontFamily: "'DM Mono', monospace",
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    flex: 1, // Ensures the search bar takes up the available space
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
  },
  searchInput: {
    width: '100%', // Makes the input take up full space
    minWidth: '300px',
    fontSize: '16px',
    border: 'none',
    outline: 'none',
    fontFamily: "'DM Mono', monospace",
    paddingLeft: '35px', // Leaves space for the icon
  },
  departmentWrapper: {
    position: 'relative',
    marginLeft: '16px',
  },
  departmentButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    outline: 'none',
    fontFamily: "'DM Mono', monospace",
  },
  arrow: {
    marginLeft: '6px',
    fontSize: '12px',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#fff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    marginTop: '4px',
    borderRadius: '4px',
    overflow: 'hidden',
    zIndex: 10,
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    padding: '8px 12px',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: "'DM Mono', monospace",
  },
};
