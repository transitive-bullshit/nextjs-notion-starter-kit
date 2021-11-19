<p align="center">
  <a href="https://transitivebullsh.it/nextjs-notion-starter-kit">
    <img alt="Example article page" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252Fd147d76c-28a4-4cdd-a503-2d6bcc50a787%252Ftransitivebullsh.it__(5)-opt.jpg%3Ftable%3Dblock%26id%3D5b87b717-ca5b-49da-b17c-12c3eab1644a%26cache%3Dv2" width="689">
  </a>
</p>

# Next.js Notion 启动套件

[英语](readme.md) | [中文](README-zh.md)

> 使用 Next.js 和 Notion 构建网站的完美入门套件。

[![jaywcjlove/sb](https://jaywcjlove.github.io/sb/lang/chinese.svg)](README-zh.md) [![Build Status](https://travis-ci.com/transitive-bullshit/nextjs-notion-starter-kit.svg?branch=main)](https://travis-ci.com/transitive-bullshit/nextjs-notion-starter-kit) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## 介绍

这个项目仓库是为了我的私人博客/作品集站点 [transitivebullsh.it](https://transitivebullsh.it) 提供动力。

它使用 Notion 作为内容管理系统，从 Notion 获取内容然后使用 [Next.js](https://nextjs.org/) 和 [react-notion-x](https://github.com/NotionX/react-notion-x) 来进行渲染。

网站被部署在了 [Vercel](http://vercel.com).

## 功能

- 配置简单 ([只有一个配置文件](./site.config.js)) 💪
- 通过以下方式对 Notion 内容提供强有力的支持 [react-notion-x](https://github.com/NotionX/react-notion-x)
- Next.js / TS / React / Notion
- 极快的页面速度
- 性感的 LQIP 图片预览
- 嵌入式的 GitHub 评论
- 自动展开图像
- 自动优化 URL
- 自动生成目录
- 对夜间/暗黑模式的全面支持
- 通过 CMD+P 快速搜索，就像在 Notion 中一样的体验
- 适用于桌面/平板电脑/手机的响应性布局
- 针对 Next.js 和 Vercel 进行了优化

## 配置

**所有的配置都定义在 [site.config.js](./site.config.js).**

1. Fork / clone 本项目/仓库
2. 更改配置文件中的属性 [site.config.js](./site.config.js)
3. 进入项目目录，执行 `npm install` 或者 `yarn` 安装依赖
4. 使用 `npm run dev` 或者 `yarn dev` 进行本地测试
5. 使用 `npm run deploy` 部署到 vercel 💪

我尽可能的使配置文件简单化。

你真正需要做的是修改`rootNotionPageId'。它默认为渲染我的网站的公共主页 [78fc5a4b88d74b0e824e29407e9f1ec1](https://notion.so/78fc5a4b88d74b0e824e29407e9f1ec1).

你需要在 Notion 中将你的根页面设置为 **public** ，复制分享链接，提取分享链接的最后部分，大概是这个样子的 `d1b5dcf8b9ff425b8aef5ce6f0730202`, 这就是你的共享页面的 ID.

为了查看你的 Notion 工作区的 ID（可选），只需要在浏览器打开你的站点页面，然后摁下`F12`使用开发者工具（Developer Tools），然后找到控制台（Console）。这里设置了一个全局变量“block”，这个全局变量存储了当前页面的 Notion 数据，你只需输入 `block.space_id` 然后摁下回车，就可以获取当前页面的工作区（workspace） ID。

我建议你设置一个主页将你要分享的页面/内容汇总（可选，本项目使用的内联画廊 <u> inline gallery </u> [样例](https://notion.so/78fc5a4b88d74b0e824e29407e9f1ec1)），你的 Notion 工作区没有结构上的限制，所以可以自由地添加内容，就像正常使用 Notion 一样。有一些代码的逻辑是只在博客文章页面（详细页面）显示评论。

## URL 路径

该应用程序在开发版和原版中默认的路径名略有不同（将任何开发版的路径名粘贴到原版中也可以使用，反过来也可以）。

在开发中，它将使用`/nextjs-notion-blog-d1b5dcf8b9ff425b8aef5ce6f0730202`，这是页面标题的后缀 Notion ID 的 slugified 版本。我发现，在本地开发过程中，总是把 Notion 页面 ID 放在前面和中间，会很有用。

在生产中，将使用`/nextjs-notion-blog`，摆脱了额外的 ID 困扰。

Notion ID 到 slugified 页面的映射在构建（build）过程中自动完成，你只需要注意如果你计划随时间给改你的页面标题，你需要确保你的旧的页面链接仍可以继续工作，除了 nextjs 内建的功能 [support for redirects](https://nextjs.org/docs/api-reference/next.config.js/redirects)，我们不提供检测旧链接的功能。

查阅 [mapPageUrl](./lib/map-page-url.ts) 和 [getCanonicalPageId](https://github.com/NotionX/react-notion-x/blob/master/packages/notion-utils/src/get-canonical-page-id.ts) 获取更多信息。

NOTE： 如果你的工作区有多个页面具有相同的 slugified 名称，应用程序将抛出一个错误：重复的 URL 路径名。

## 主题

所有的自定 Notion 内容样式的设置都在这个文件 [styles/notion.css](./styles/notion.css)

[styles.css](https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/styles.css) 主要针对由 react-notion-x 输出的全局 CSS 类。

在本地开发和热重载的情况下定制页面样式是很容易的。

### 暗黑模式/夜间模式

<p align="center">
  <img alt="Light Mode" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F83ea9f0f-4761-4c0b-b53e-1913627975fc%252Ftransitivebullsh.it_-opt.jpg%3Ftable%3Dblock%26id%3Ded7e8f60-c6d1-449e-840b-5c7762505c44%26cache%3Dv2" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Dark Mode" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252Fc0839d6c-7141-48df-8afd-69b27fed84aa%252Ftransitivebullsh.it__(1)-opt.jpg%3Ftable%3Dblock%26id%3D23b11fe5-d6df-422d-9674-39cf7f547523%26cache%3Dv2" width="45%">
</p>

完全支持黑暗模式/夜间模式，可以通过页脚的太阳/月亮图标进行切换。

## 附加内容

所有额外的依赖都是可选的 -- 该项目在开箱后应该可以正常工作。

如果你想复制我的网站的一些更高级的元素，你需要设置一些额外的东西。

### Fathom 分析

[Fathom](https://usefathom.com/ref/42TFOZ) 提供了一个轻量的 Google 分析替代方案。

这是可选的，但我真的喜欢他们如此简单和优雅的解决方案。

要启用分析功能，只需添加一个`NEXT_PUBLIC_FATHOM_ID`环境变量。

这个环境变量只有在生产中才会使用，所以你不必担心在本地主机开发中搞乱了你的分析结果。

### GitHub 评论

<p align="center">
  <img alt="Embedded GitHub Comments" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252Fa43f996c-de07-4d8a-8461-b35f9d43e4b2%252Fcomments-desktop-opt.jpg%3Ftable%3Dblock%26id%3Ded07d7c2-57c9-4aba-81b3-f5fa069371d4%26cache%3Dv2" width="420">
</p>

[Utteranc.es](https://utteranc.es/) 是一个神奇的 [开源项目](https://github.com/utterance/utterances) 使开发者能够将 GitHub 的问题作为评论部分嵌入到他们的网站上。

整合真的很简单。只需编辑`utterancesGitHubRepo`配置值，指向你想用于问题评论的 repo。

在生产中启用这个功能之前，你可能需要通读 Utterances 的文档，因为在 issues 如何被映射到你的网站上的页面方面有一些微妙的问题，但总的来说，设置是超级简单的，我喜欢这个结果。

### 效果预览

这是一个非常酷的功能，它的灵感来自于 Medium 的平滑图片加载，我们首先加载一个低质量的、模糊的图片版本，一旦加载完毕，就在全质量的版本中制作动画。这是一个很好的效果，但这需要额外的设置。

如果`isPreviewImageSupportEnabled`被设置为`true`，那么应用程序将通过 [lqip-modern](https://github.com/transitive-bullshit/lqip-modern) 为 Notion 工作区引用的所有图片计算 LQIP 图片。这些图像将被存储在 Google Firebase 集合中（作为 base64 的 JPEG 数据），所以它们只需要被计算一次。

你必须建立你自己的谷歌 Firebase 的 Firestore 实例，并提供三个环境变量。

```bash
# 包含你的谷歌凭证 json 文件的 base64 编码字符串
GOOGLE_APPLICATION_CREDENTIALS=

# 你的谷歌云项目的名称
GCLOUD_PROJECT=

# Firebase 集合的名称，用于存储图像
FIREBASE_COLLECTION_IMAGES=
```

实际工作发生在 [create-preview-image](./api/create-preview-image) 无服务器函数中。

### 自动生成社交图像

<p align="center">
  <img alt="Auto-generated social image" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252Fe1877c31-0bc9-46b7-8aaf-7bcae21baf2b%252Fsocial-image-opt.jpeg%3Ftable%3Dblock%26id%3D735b04d2-2a77-4035-8942-a17f8d41fe83%26cache%3Dv2" width="420">
</p>

像这样的 Open Graph 图像将根据每个页面的内容为你网站的每个页面自动生成。

请注意，只要你部署到 Vercel，你不应该做任何额外的事情来启用这个功能。

### 自动目录

<p align="center">
  <img alt="Smooth ToC Scrollspy" src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fcb2df62d-9028-440b-964b-117711450921%2Ftoc2.gif?table=block&id=d7e9951b-289c-4ff2-8b82-b0a61fe260b1&cache=v2" width="240">
</p>

默认情况下，每篇文章的页面都会有一个目录，在桌面上以 "aside" 的形式显示。它使用** scrollspy **逻辑，在用户滚动浏览你的文档时自动更新当前章节，并使你在不同的章节之间跳转变得非常容易。

如果一个页面的内容少于`minTableOfContentsItems`（默认为 3），目录将被隐藏。在索引页和浏览器窗口太小的情况下，它也会被隐藏。

This table of contents uses the same logic that Notion uses for its built-in Table of Contents block (see [getPageTableOfContents](https://github.com/NotionX/react-notion-x/blob/master/packages/notion-utils/src/get-page-table-of-contents.ts) for the underlying logic and associated unit tests).

## 屏幕截图

### 移动端文章页面

<p align="center">
  <a href="https://transitivebullsh.it/free-resources-for-indie-saas-devs">
    <img alt="Mobile Article Page" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F6c05a0f9-59a0-4322-bef9-3f08fe4efc6a%252Farticle-mobile-opt.jpg%3Ftable%3Dblock%26id%3Da1eb2263-fdf1-4d51-a3d4-8a02cb32bbba%26cache%3Dv2" width="300">
  </a>
</p>

### 桌面主页

<p align="center">
  <a href="https://transitivebullsh.it">
    <img alt="Desktop Home Page" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F1d3ab4b2-60af-4b95-b35d-cac5d440b8ca%252Ftransitivebullsh.it_-opt.jpg%3Ftable%3Dblock%26id%3D97f445e8-2da1-41cd-996a-5ad0e73a1d79%26cache%3Dv2" width="600">
  </a>
</p>

### 桌面文章页面 （暗黑模式/夜间模式）

<p align="center">
  <a href="https://transitivebullsh.it/free-resources-for-indie-saas-devs">
    <img alt="Desktop Article Page" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252Fb564d13f-b71b-4473-8531-65b5dd9b995f%252Ftransitivebullsh.it__(4)-opt.jpg%3Ftable%3Dblock%26id%3D16e03de2-0df7-4232-a129-e1666505c4d2%26cache%3Dv2" width="600">
  </a>
</p>

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my open source work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
