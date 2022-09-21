# Registry Web

[![Build Status](https://github.com/treely/registry-web/actions/workflows/build.yml/badge.svg)](https://github.com/treely/registry-web/actions/workflows/build.yml)

## Intro

This repo powers https://wagmi-tech.com.
It uses Notion as a CMS, [react-notion-x](https://github.com/NotionX/react-notion-x), [Next.js](https://nextjs.org/), and [Vercel](https://vercel.com).

This web app is based on [The Next.js Notion starter kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit).
You can also find the documentation there.

## Setup

**All config is defined in [site.config.ts](./site.config.ts).**

This project requires a recent version of Node.js (>= 14.17).

1. Fork / clone this repo
2. Change a few values in [site.config.ts](./site.config.ts)
3. `npm install`
4. `npm run dev` to test locally
5. `npm run deploy` to deploy to vercel 💪
