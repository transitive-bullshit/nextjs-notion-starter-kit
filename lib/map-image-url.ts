import { Block } from 'notion-types'
import { defaultMapImageUrl } from 'react-notion-x'

import { defaultPageCover, defaultPageIcon } from './config'

export const mapImageUrl = (url: string, block: Block) => {
  // default to using the default page cover.
  if (url === defaultPageCover || url === defaultPageIcon) {
    return url
  }
  // TODO: load image from notion host is too slow in PRC
  // TODO: cancel this changes.
  // Solution (maybe): 
  // * save cache on storage server in home country
  // check if the url is a notion image
  // that's means the image is referenced by the notion page
  // in order to quickly load the image, we need to load it directly
  // if (url.startsWith("http") || url.startsWith("https")) {
  //   const pu = new URL(url)
  //   if (!pu.host.includes("amazonaws.com")) {
  //     return url
  //   }
  // }
  // console.log("load", url, defaultMapImageUrl(url, block));
  return defaultMapImageUrl(url, block)
}
