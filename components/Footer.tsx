import * as React from 'react'
import * as config from 'lib/config'

// TODO: merge the data and icons from PageSocial with the social links in Footer

export const Footer: React.FC<{
  isDarkMode: boolean
  toggleDarkMode: () => void
}> = ({ isDarkMode, toggleDarkMode }) => {
  const [hasMounted, setHasMounted] = React.useState(false)
  const toggleDarkModeCb = React.useCallback(
    (e) => {
      e.preventDefault()
      toggleDarkMode()
    },
    [toggleDarkMode]
  )

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <footer className={"footer"}>
      <div className={"copyright"}>Copyright 2021 {config.author}</div>

      {hasMounted ? (
        <div className={"settings"}>
          <a
            className={"toggleDarkMode"}
            onClick={toggleDarkModeCb}
            title='Toggle dark mode'
          >
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </a>
        </div>
      ) : null}

    </footer>
  )
}
