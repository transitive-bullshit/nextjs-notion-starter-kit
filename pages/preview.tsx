import * as React from 'react'
import { NotionPage } from '@/components/NotionPage'
import { useEffect, useState } from 'react'
import { api, apiHost } from '@/lib/config'

export default function Preview() {
  const [pageid, setPageId] = useState(() => {
    return typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('pageid');
  });

  const [props, setProps] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${apiHost}${api.getNotionPageProps}`, {
        method: 'POST',
        body: JSON.stringify({
          pageId: pageid
        }),
        headers: {
          'content-type': 'application/json'
        }
      }).then((response) => response.json())
        .then((data) => {
          debugger;
          setProps(data);
        })
        .catch((err) => {
          console.log(err)
        })
    }
    fetchData()
  }, []);

  if (!props) {
    return (<div>Loading...</div>)
  }
  return <><NotionPage {...props} /></>
}
