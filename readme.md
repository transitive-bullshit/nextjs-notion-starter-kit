<p align="center">
  <a href="https://philipredford.com/">
    <img alt="Example article page" src="public/example_page.png" width="689">
  </a>
</p>


# Personal Website: [Philip Redford](https://philipredford.com/)

[![Build Status](https://github.com/transitive-bullshit/nextjs-notion-starter-kit/actions/workflows/build.yml/badge.svg)](https://github.com/transitive-bullshit/nextjs-notion-starter-kit/actions/workflows/build.yml) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)
![GitHub last commit](https://img.shields.io/github/last-commit/philiprj/personal_website1.0?logo=hey)
![Build Workflow Status](https://img.shields.io/github/workflow/status/philiprj/personal_website1.0/scheduled)

## Intro

This repo is a fork of [transitive-bullshit/nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit).

It uses Notion as a CMS, [react-notion-x](https://github.com/NotionX/react-notion-x), [Next.js](https://nextjs.org/), and [Vercel](https://vercel.com).

## Setup

**All config is defined in [site.config.ts](./site.config.ts).**

This project requires a recent version of Node.js (recommend >= 16).

1. `npm install`
2. `npm run dev` to test locally
3. `npm run deploy` to deploy to vercel 💪

### Vercel Configuration

**Social media preview images won't work by default on Vercel**. You'll need to ensure that your site doesn't require auth.

From your Vercel project settings, you'll want to **disable Vercel Authentication** from `Project -> Settings -> Deployment Protection`.

![How to disable Vercel Deployment Protection setting](https://github.com/user-attachments/assets/a1eb5a1f-da7a-497e-b4f6-f7e851a6cd8a 'How to disable Vercel Deployment Protection setting which causes social media preview image endpoint to return 401 Unauthorized')

### Redis

Redis is used to cache generated preview images to speed up subsequent builds. [Redis Labs](https://redis.com) is used as the exertnal [Redis](https://redis.io) data store. To enable redis caching, `isRedisEnabled` is set to `true` in `site.config.ts` and then `REDIS_HOST` and `REDIS_PASSWORD` environment variables to point to the redis instance.

Locally this is done by adding a `.env` file:

```bash
REDIS_HOST='TODO'
REDIS_PASSWORD='TODO'
```

## Styles

All CSS styles that customize Notion content are located in [styles/notion.css](./styles/notion.css). They mainly target global CSS classes exported by react-notion-x [styles.css](https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/styles.css).

Every notion block gets its own unique classname, so you can target individual blocks like this:

```css
.notion-block-260baa77f1e1428b97fb14ac99c7c385 {
  display: none;
}
```

## Dark Mode

<p align="center">
  <img alt="Light Mode" src="https://transitive-bs.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F83ea9f0f-4761-4c0b-b53e-1913627975fc%2Ftransitivebullsh.it_-opt.jpg?table=block&id=ed7e8f60-c6d1-449e-840b-5c7762505c44&spaceId=fde5ac74-eea3-4527-8f00-4482710e1af3&width=2000&userId=&cache=v2" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Dark Mode" src="https://transitive-bs.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fc0839d6c-7141-48df-8afd-69b27fed84aa%2Ftransitivebullsh.it__(1)-opt.jpg?table=block&id=23b11fe5-d6df-422d-9674-39cf7f547523&spaceId=fde5ac74-eea3-4527-8f00-4482710e1af3&width=2000&userId=&cache=v2" width="45%">
</p>

Dark mode is fully supported and can be toggled via the sun / moon icon in the footer.


## Responsive

<p align="center">
  <img alt="Mobile article page" src="https://user-images.githubusercontent.com/552829/160132983-c2dd5830-80b3-4a0e-a8f1-abab5dbeed11.jpg" width="300">
</p>

All pages are designed to be responsive across common device sizes.

## Environment Variables

Redis environment variables, have been [added to the Vercel project](https://vercel.com/docs/concepts/projects/environment-variables). These environment variables have been added as GitHub [repository secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

## Features

- Robust support for Notion content via [react-notion-x](https://github.com/NotionX/react-notion-x)
- Built using Next.js, TS, and React
- Full support for dark mode
- Quick search via CMD+K / CMD+P
- Responsive for different devices
- Optimized for Next.js and Vercel
