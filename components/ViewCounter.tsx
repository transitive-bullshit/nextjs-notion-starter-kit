import React, { useEffect } from 'react'
import useSWR from 'swr'
import format from 'comma-number'

export function ViewCounter({ slug }) {
  const { data } = useSWR(`/api/views/${slug}`, (args) =>
    fetch(args).then((res) => res.json())
  )
  const views = data?.total

  useEffect(() => {
    const registerView = () =>
      fetch(`/api/views/${slug}`, {
        method: 'POST'
      })

    registerView()
  }, [slug])

  return <>{views ? format(views) : '…'} views</>
}
