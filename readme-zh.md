<p align="center">
  <a href="https://transitivebullsh.it/nextjs-notion-starter-kit">
    <img alt="Example article page" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252Fd147d76c-28a4-4cdd-a503-2d6bcc50a787%252Ftransitivebullsh.it__(5)-opt.jpg%3Ftable%3Dblock%26id%3D5b87b717-ca5b-49da-b17c-12c3eab1644a%26cache%3Dv2" width="689">
  </a>
</p>

# Next.js Notion 入门套件

> 使用 Next.js 和 Notion 构建网站的完美入门套件。

[![Build Status](https://travis-ci.com/transitive-bullshit/nextjs-notion-starter-kit.svg?branch=main)](https://travis-ci.com/transitive-bullshit/nextjs-notion-starter-kit) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

[EN](readme.md) | [中文](readme-zh.md)

## 介绍

我使用这个仓库来驱动我的个人博客/作品集网站 [transitivebullsh.it](https://transitivebullsh.it)。

它将 Notion 作为内容管理系统，从 Notion 中获取内容，然后使用 [Next.js](https://nextjs.org/) 和 [react-notion-x](https://github.com/NotionX/react-notion-x) 进行渲染展示。

此网站已部署到 [Vercel](http://vercel.com)。

## 功能

- 几分钟即可完成配置([单独的配置文件](./site.config.js))💪
- 通过 [react-notion-x](https://github.com/NotionX/react-notion-x) 对 Notion 的内容提供强大支持
- Next.js / TS / React / Notion
- 卓越的页面渲染速度
- 受欢迎的 LQIP（低质量图像占位符）图像预览
- 内嵌 GitHub 评论
- 自动处理 OG（开放图谱协议）图片
- 自动美化链接
- 自动生成目录
- 全面支持深色模式
- 和 Notion 一样，通过 CMD+P 进行快速搜索
- 桌面端/平板/移动端 自适应
- 针对 Next.js 和 Vercel 进行了优化

## 配置

**所有的配置定义都在 [site.config.js](./site.config.js) 文件里。**

1. Fork / clone 本项目
2. 更改配置属性 [site.config.js](./site.config.js)
3. `npm install` 安装依赖
4. `npm run dev` 在本地测试
5. `npm run deploy` 部署到 vercel 💪

我尽可能的使配置文件简单化。

您首先要做的就是编辑 `rootNotionPageId`。它默认展示我的网站上公开的 Notion 页面 [78fc5a4b88d74b0e824e29407e9f1ec1](https://notion.so/78fc5a4b88d74b0e824e29407e9f1ec1)。

您需要在 Notion 中将您的根页面权限设置为 public ，然后复制链接到剪贴板，截取 URL 最后面看起来像 `d1b5dcf8b9ff425b8aef5ce6f0730202` 的部分，这就是您页面的 Notion ID.

为了方便您查看 Notion 工作区的 ID（可选），只需要在浏览器打开您的站点页面并打开开发者控制台。在这里您可以访问一个全局变量 `block`，它里面是当前页面的 Notion 数据，输入 `block.space_id` 然后回车，控制台就会打印出页面的工作区 ID。

我推荐您在主页设置一个集合，用来汇总您将要分享的页面、项目、内容（可选，我在[这里](https://notion.so/78fc5a4b88d74b0e824e29407e9f1ec1)使用了内联画廊）。当然，您的 Notion 工作区没有结构限制，您可以自由地添加内容，就像正常使用 Notion 一样。有一些带有逻辑的代码只会用来在博客文章页面(集合项详情页面)上显示注释。

## 网址路径

该应用程序默认在 dev 和 prod 中使用略有不同的路径名（尽管将任意 dev 路径名粘贴到 prod 中也可以运行，反之亦然）。

在开发环境中，它会使用 `/nextjs-notion-blog-d1b5dcf8b9ff425b8aef5ce6f0730202`， 这是以 Notion ID 为后缀的 slugified 版本的页面标题。我发现在本地开发过程中始终将 Notion 页面 ID 放在前面和中间非常有用。

生产环境中，它会使用 `/nextjs-notion-blog`，因为它消除了额外的 ID 混乱，这样更好一些。

作为构建过程的一部分，Notion ID 到 slugified 页面标题的映射是自动完成的。请记住，如果您打算随着时间的推移更改页面标题，您可能还希望确保旧链接仍然有效，除了 Next.js 内置[重定向支持](https://nextjs.org/docs/api-reference/next.config.js/redirects)之外，我们目前不提供检测旧链接的解决方案。

有关更多详细信息，请参阅 [mapPageUrl](./lib/map-page-url.ts) 和 [getCanonicalPageId](https://github.com/NotionX/react-notion-x/blob/master/packages/notion-utils/src/get-canonical-page-id.ts)。

注意：如果您的工作区中有多个页面具有相同的 slugified 名称，应用程序将抛出一个错误，让您知道存在重复的 URL 路径名。

## 主题化

所有自定义 Notion 内容的 CSS 样式都位于 [styles/notion.css](./styles/notion.css) 中。

它们主要是针对 react-notion-x [styles.css](https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/styles.css) 导出的全局 CSS 类。

本地开发，开启热加载的情况下，大多数与样式相关的东西很容易自定义。

### 深色模式

<p align="center">
  <img alt="Light Mode" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252F83ea9f0f-4761-4c0b-b53e-1913627975fc%252Ftransitivebullsh.it_-opt.jpg%3Ftable%3Dblock%26id%3Ded7e8f60-c6d1-449e-840b-5c7762505c44%26cache%3Dv2" width="45%"> 
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Dark Mode" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252Fc0839d6c-7141-48df-8afd-69b27fed84aa%252Ftransitivebullsh.it__(1)-opt.jpg%3Ftable%3Dblock%26id%3D23b11fe5-d6df-422d-9674-39cf7f547523%26cache%3Dv2" width="45%">
</p>

完全支持深色模式，您可以通过页面底部的太阳/月亮图标进行切换。


## 附加功能

所有额外的依赖项都是可选的 —— 项目应该开箱即用。

如果您想复制我网站的一些更高级的元素，那么您必须额外设置一些东西。

### Fathom 分析

[Fathom](https://usefathom.com/ref/42TFOZ) 提供了一个轻量的 Google 分析替代方案。

这是可选的，不过我真的很喜欢他们如此简单优雅的解决方案。

只需添加一个 `NEXT_PUBLIC_FATHOM_ID` 环境变量，就可以启用分析功能，。

这个环境变量只有在生产环境中才会使用，所以您不必担心在本地主机的开发会搞乱您的分析结果。

### GitHub 评论

<p align="center">
  <img alt="Embedded GitHub Comments" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252Fa43f996c-de07-4d8a-8461-b35f9d43e4b2%252Fcomments-desktop-opt.jpg%3Ftable%3Dblock%26id%3Ded07d7c2-57c9-4aba-81b3-f5fa069371d4%26cache%3Dv2" width="420">
</p>



[Utteranc.es](https://utteranc.es/) 是一个了不起的[开源项目](https://github.com/utterance/utterances)，它使开发人员能够将 GitHub issues 作为评论嵌入到他们的网站上。天才。 

集成非常简单，只需编辑 `utterancesGitHubRepo` 指向您要用于 issue 评论的 repo。

在生产中启用这个功能之前，您可能需要通读 Utterances 的文档，因为在 issues 如何被映射到您的网站页面方面有一些细微的问题，但总的来说，设置非常简单，效果我很喜欢。

### 图像预览

这是一个非常酷的功能，其灵感来自于 Medium 的平滑图像加载，我们首先加载一个低质量，模糊版本的图像，并在加载后用完整质量版本的图像进行动画处理。这个效果很好，不过它确实增加了一些设置工作。

如果 `isPreviewImageSupportEnabled` 设置为 `true`，则应用程序将通过 [lqip-modern](https://github.com/transitive-bullshit/lqip-modern) 为您的 Notion 工作区引用的所有图像计算 LQIP 图像。这些图像将（作为 base64 JPEG 数据）存储在 Google Firebase 的 Collection 中，因此它们只需要计算一次。

您必须设置自己的 Google Firebase 的 Firestore 实例，并提供三个环境变量：

```bash
# 包含你的谷歌凭证 json 文件的 base64 编码字符串
GOOGLE_APPLICATION_CREDENTIALS=

# 你的谷歌云项目的名称
GCLOUD_PROJECT=

# 用于存储图像的 Firebase collection 的名称
FIREBASE_COLLECTION_IMAGES=
```

实际的工作发生在 [create-preview-image](./api/create-preview-image) serverless 函数中。

### 自动处理社交图像

<p align="center">
  <img alt="Auto-generated social image" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252Fe1877c31-0bc9-46b7-8aaf-7bcae21baf2b%252Fsocial-image-opt.jpeg%3Ftable%3Dblock%26id%3D735b04d2-2a77-4035-8942-a17f8d41fe83%26cache%3Dv2" width="420">
</p>

将根据每个页面的内容为您网站的每个页面自动生成像这样的 Open Graph 图像。

请注意，只要您部署到 Vercel，就无需执行任何额外操作即可启用此功能。

### 自动生成目录

<p align="center">
  <img alt="Smooth ToC Scrollspy" src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fcb2df62d-9028-440b-964b-117711450921%2Ftoc2.gif?table=block&id=d7e9951b-289c-4ff2-8b82-b0a61fe260b1&cache=v2" width="240">
</p>

默认情况下，每个文章页面都会有一个目录作为 `aside` 显示在桌面上。当用户滚动浏览文档时，它使用 **scrollspy** 逻辑自动更新当前部分，并使得在不同部分之间跳转非常容易。

如果页面内容少于 `minTableOfContentsItems`（默认 3），则目录将被隐藏。如果浏览器窗口太小，它也会隐藏在索引页面上。

此目录使用与 Notion 内置的目录块相同的逻辑（请参阅 [getPageTableOfContents](https://github.com/NotionX/react-notion-x/blob/master/packages/notion-utils/src/get-page-table-of-contents.ts) 以了解底层逻辑和相关的单元测试）。

## 截图

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

### 桌面端文章页面（深色模式）

<p align="center">
  <a href="https://transitivebullsh.it/free-resources-for-indie-saas-devs">
    <img alt="Desktop Article Page" src="https://ssfy.io/https%3A%2F%2Fwww.notion.so%2Fimage%2Fhttps%253A%252F%252Fs3-us-west-2.amazonaws.com%252Fsecure.notion-static.com%252Fb564d13f-b71b-4473-8531-65b5dd9b995f%252Ftransitivebullsh.it__(4)-opt.jpg%3Ftable%3Dblock%26id%3D16e03de2-0df7-4232-a129-e1666505c4d2%26cache%3Dv2" width="600">
  </a>
</p>

## 许可证

MIT © [Travis Fischer](https://transitivebullsh.it)

<a href="https://twitter.com/transitive_bs">在 twitter 上关注我<img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a> 支持我的开源工作
