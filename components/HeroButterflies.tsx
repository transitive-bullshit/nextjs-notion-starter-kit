/* Notion block wrapper already exists → just render butterflies inside */
export function HeroButterflies() {
    return (
      <>
        {/* top–left */}
        <svg className="butterfly tl" aria-hidden="true">
          <use href="#butterfly" />
        </svg>
  
        {/* top–right (mirrored) */}
        <svg className="butterfly tr" aria-hidden="true">
          <use href="#butterfly" />
        </svg>
  
        {/* bottom–left (mirrored vertically) */}
        <svg className="butterfly bl" aria-hidden="true">
          <use href="#butterfly" />
        </svg>
  
        {/* bottom–right */}
        <svg className="butterfly br" aria-hidden="true">
          <use href="#butterfly" />
        </svg>
  
        {/* hidden symbol definition – only one copy goes to the DOM */}
        <svg style={{ display: 'none' }}>
          <symbol id="butterfly" 
            xmlns="http://www.w3.org/2000/svg" width="39" height="25" viewBox="0 0 39 25" fill="none">
            <path d="M2.34711 11.021C9.05935 11.021 16.4062 11.0921 22.4207 14.529C25.2881 16.1675 28.6572 25.5296 28.6572 22.2271C28.6572 12.7972 25.2473 2.25093 37.4273 2.25093" stroke="black" stroke-width="3" stroke-linecap="round"/>
          </symbol>
        </svg>
      </>
    );
  }
  