import * as React from 'react'
import { NextRequest } from 'next/server'

import { ImageResponse } from '@vercel/og'

import { api, apiHost, rootNotionPageId } from '@/lib/config'
import { NotionPageInfo } from '@/lib/types'

const interRegularFontP = fetch(
  new URL('../../public/fonts/Inter-Regular.ttf', import.meta.url)
).then((res) => res.arrayBuffer())

const interBoldFontP = fetch(
  new URL('../../public/fonts/Inter-SemiBold.ttf', import.meta.url)
).then((res) => res.arrayBuffer())

export const config = {
  runtime: 'experimental-edge'
}

export default async function OGImage(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const pageId = searchParams.get('id') || rootNotionPageId
  if (!pageId) {
    return new Response('Invalid notion page id', { status: 400 })
  }

  const pageInfoRes = await fetch(`${apiHost}${api.getNotionPageInfo}`, {
    method: 'POST',
    body: JSON.stringify({ pageId }),
    headers: {
      'content-type': 'application/json'
    }
  })
  if (!pageInfoRes.ok) {
    return new Response(pageInfoRes.statusText, { status: pageInfoRes.status })
  }
  const pageInfo: NotionPageInfo = await pageInfoRes.json()
  console.log(pageInfo)

  const [interRegularFont, interBoldFont] = await Promise.all([
    interRegularFontP,
    interBoldFontP
  ])

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1F2027',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Inter", sans-serif',
          color: 'black'
        }}
      >
        {pageInfo.image && (
          <img
            src={pageInfo.image}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover'
              // TODO: satori doesn't support background-size: cover and seems to
              // have inconsistent support for filter + transform to get rid of the
              // blurred edges. For now, we'll go without a blur filter on the
              // background, but Satori is still very new, so hopefully we can re-add
              // the blur soon.

              // backgroundImage: pageInfo.image
              //   ? `url(${pageInfo.image})`
              //   : undefined,
              // backgroundSize: '100% 100%'
              // TODO: pageInfo.imageObjectPosition
              // filter: 'blur(8px)'
              // transform: 'scale(1.05)'
            }}
          />
        )}

        <div
          style={{
            position: 'relative',
            width: 900,
            height: 465,
            display: 'flex',
            flexDirection: 'column',
            border: '16px solid rgba(0,0,0,0.3)',
            borderRadius: 8,
            zIndex: '1'
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              backgroundColor: '#fff',
              padding: 24,
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            {pageInfo.detail && (
              <div style={{ fontSize: 32, opacity: 0 }}>{pageInfo.detail}</div>
            )}

            <div
              style={{
                fontSize: 70,
                fontWeight: 700,
                fontFamily: 'Inter'
              }}
            >
              {pageInfo.title}
            </div>

            {pageInfo.detail && (
              <div style={{ fontSize: 32, opacity: 0.6 }}>
                {pageInfo.detail}
              </div>
            )}
          </div>
        </div>

        {pageInfo.authorImage && (
          <div
            style={{
              position: 'absolute',
              top: 47,
              left: 104,
              height: 128,
              width: 128,
              display: 'flex',
              borderRadius: '50%',
              border: '4px solid #fff',
              zIndex: '5'
            }}
          >
            <img
              src={pageInfo.authorImage}
              style={{
                width: '100%',
                height: '100%'
                // transform: 'scale(1.04)'
              }}
            />
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interRegularFont,
          style: 'normal',
          weight: 400
        },
        {
          name: 'Inter',
          data: interBoldFont,
          style: 'normal',
          weight: 700
        }
      ]
    }
  )
}
