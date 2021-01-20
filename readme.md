<p align="center">
  <img alt="Example article page" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F236cc4f2-4a85-4eb6-8f6a-4b835ccf63dd%252Farticle-desktop-opt.jpg%3Ftable%3Dblock%26id%3D16e03de2-0df7-4232-a129-e1666505c4d2%26cache%3Dv2" width="689">
</p>

# Next.js Notion Starter Kit

> The perfect starter kit for building beautiful Next.js websites that are backed by Notion content.

[![Build Status](https://travis-ci.com/tansitive-bullshit/nextjs-notion-starter-kit.svg?branch=master)](https://travis-ci.com/tansitive-bullshit/nextjs-notion-starter-kit) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## Intro

This repo is what I use to power my personal blog / portfolio site [transitivebullsh.it](https://transitivebullsh.it).

It uses Notion as a CMS, fetching content from a [root Notion doc](https://notion.so/78fc5a4b88d74b0e824e29407e9f1ec1) and then uses [Next.js](https://nextjs.org/) and [react-notion-x](https://github.com/NotionX/react-notion-x) to render everything with great perf and custom styling.

The site is then deployed to [Vercel](http://vercel.com).

## Features

- Setup only takes a few minutes! ([single config file](./site.config.js)) 💪
- Next.js / TS / React / Notion -- what more could you want?!
- Robust support for Notion content via [react-notion-x](https://github.com/NotionX/react-notion-x)
- Excellent page speeds
- Sexy LQIP image previews
- Embedded GitHub comments
- Automatic open graph images
- Automatic pretty URL paths
- Quick search via CMD+P just like in Notion
- Responsive for desktop / tablet / mobile
- Optimized for Next.js and Vercel

## Setup

**All config is defined in [site.config.js](./site.config.js).**

1. Fork / clone this repo
2. Change a few values in [site.config.js](./site.config.js)
3. `npm install`
4. `npm run dev` to test locally
5. `run run deploy` to deploy to vercel 💪

I tried to make configuration as easy as possible -- all you really need to change to get started is edit `rootNotionPageId`.

You'll want to make your root Notion page **public** and then copy the link to your clipboard. Now just extract the last part of the URL that looks like `d1b5dcf8b9ff425b8aef5ce6f0730202` as your root Notion page iD.

I recommend setting up a collection on your home page (I used an inline gallery [here](https://notion.so/78fc5a4b88d74b0e824e29407e9f1ec1)) that contains all of your articles / projects / content. There are no structural constraints on your Notion workspace, however, so feel free to add content as you would normally in Notion. There are a few parts of the code with logic to only show comments on blog post pages (collection item detail pages).

## URL Pathnames

The app defaults to slightly different pathnames in dev and prod (though pasting any dev pathname into prod will work and vice-versa).

In development, it will use `/nextjs-notion-blog-d1b5dcf8b9ff425b8aef5ce6f0730202` which is a slugified version of the page's title suffixed with its Notion ID. I've found that it's really useful to always have the Notion Page ID front and center during local development.

In production, it will use `/nextjs-notion-blog` which is a bit nicer as it gets rid of the extra ID clutter.

The mapping of Notion ID to slugified page titles is done automatically for you as part of the build process. Just keep in mind that if you plan on changing page titles over time, you probably want to make sure old links will still work, and we don't currently provide a solution for detecting old links aside from Next.js built-in [support for redirects](https://nextjs.org/docs/api-reference/next.config.js/redirects).

See [mapPageUrl](./lib/map-page-url.ts) and [getCanonicalPageId](https://github.com/NotionX/react-notion-x/blob/master/packages/notion-utils/src/get-canonical-page-id.ts) from for more details.

NOTE: if you have multiple pages in your workspace with the same slugified name, the app will throw an error letting you know that there are duplicate URL pathnames.

## Extras

All extra dependencies are optional -- the project should work just fine out of the box.

If you want to copy some of the fancier elements of my site, then you'll have to set up a few extras.

#### Fathom Analytics

[Fathom](https://usefathom.com/ref/42TFOZ) provides a lightweight alternative to Google Analytics.

It's optional, but I really love how simple and elegant their solution is.

To enable analytics, just add a `NEXT_PUBLIC_FATHOM_ID` environment variable.

This environment variable will only be taken into account in production, so you don't have to worry about messing up your analytics with localhost development.

#### GitHub Comments

[Utteranc.es](https://utteranc.es/) is an amazing [open source project](https://github.com/utterance/utterances) which enables developers to embed GitHub issues as a comments section on their websites. Genius.

The integration is really simple. Just edit the `utterancesGitHubRepo` config value to point to the repo you'd like to use for issue comments.

You probably want to read through the Utterances docs before enabling this in production, since there are some subtleties around how issues get mapped to pages on your site, but overall the setup was super easy imho and I love the results.

#### Preview Images

This is a really cool feature that's inspired by Medium's smooth image loading, where we first load a low quality, blurred version of an image and animate in the full quality version once it loads. It's such a nice effect, but it does add a bit of work to set up.

If `isPreviewImageSupportEnabled` is set to `true`, then the app will compute LQIP images via [lqip-modern](https://github.com/transitive-bullshit/lqip-modern) for all images referenced by your Notion workspace. These will be stored in a Google Firebase collection (as base64 JPEG data), so they only need to be computed once.

You'll have to set up your own Google Firebase instance of Firestore and supply three environment variables:

```bash
# base64-encoded string containing your google credentials json file
GOOGLE_APPLICATION_CREDENTIALS=

# name of your google cloud project
GCLOUD_PROJECT=

# name of the firebase collection to store images in
FIREBASE_COLLECTION_IMAGES=
```

The actual work happens in the [create-preview-image](./api/create-preview-image) serverless function.

#### Automatic Social Images

<p align="center">
  <img alt="Auto-generated social image" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252Fe1877c31-0bc9-46b7-8aaf-7bcae21baf2b%252Fsocial-image-opt.jpeg%3Ftable%3Dblock%26id%3D735b04d2-2a77-4035-8942-a17f8d41fe83%26cache%3Dv2" width="600">
</p>

Open Graph images like this one will be generated for each page of your site automatically based each page's content.

By default, it takes into account:

- cover image (falling back to a default site-wide cover image)
- page icon (falling back to a default site-wide icon)
- page title
- page subtitle (optional; pulled from the "Description" property of collection pages)

This feature works by rendering some custom HTML to a [Puppeteer](https://pptr.dev) instance in this [serverless function](./api/render-social-image/[pageId].ts) that takes in the page ID as input.

Here's an example of a social image URL in production: [/api/render-social-image/71201624b204481f862630ea25ce62fe](https://transitivebullsh.it/api/render-social-image/71201624b204481f862630ea25ce62fe)

Note that you shouldn't have to do anything extra to enable this feature as long as you're deploying to Vercel.

## Screenshots

### Mobile Home Page

<img alt="Mobile Home Page" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F8ee728ab-d77e-411b-ab37-ce71b25dddfb%252Fhome-mobile-opt.jpg%3Ftable%3Dblock%26id%3Dbb5cb99f-f3fe-4060-8c42-05ff80c26f38%26cache%3Dv2" width="300">

### Mobile Article Page

<img alt="Mobile Article Page" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F6c05a0f9-59a0-4322-bef9-3f08fe4efc6a%252Farticle-mobile-opt.jpg%3Ftable%3Dblock%26id%3Da1eb2263-fdf1-4d51-a3d4-8a02cb32bbba%26cache%3Dv2" width="300">

### Desktop Home Page

<img alt="Desktop Home Page" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F657b2c1b-c548-4a05-b6b7-09c6fe2f65b0%252Fhome-desktop-opt.jpg%3Ftable%3Dblock%26id%3D97f445e8-2da1-41cd-996a-5ad0e73a1d79%26cache%3Dv2" width="600">

### Desktop Article Page

<img alt="Desktop Article Page" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F236cc4f2-4a85-4eb6-8f6a-4b835ccf63dd%252Farticle-desktop-opt.jpg%3Ftable%3Dblock%26id%3D16e03de2-0df7-4232-a129-e1666505c4d2%26cache%3Dv2" width="600">

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my open source work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
