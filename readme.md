<div align="left">
<h1>Notion-Blog Template <img src="https://github.com/RichardS0268/Blog/blob/main/public/feedback-fingerheart.gif", height=40px> </h1>
</div>

## Description
<div align="left">
<img src="https://github.com/RichardS0268/Blog/blob/main/public/React.png", height=30px>
<img src="https://github.com/RichardS0268/Blog/blob/main/public/Notion.png", height=30px>
</div>

This repo is forked from [nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit). Thanks to @[Travis Fischer](https://github.com/transitive-bullshit), I constructed my personal blog successfully even if I barely know `React` and  `TypeScript`.

This repo uses api of [Notion](https://www.notion.so), thus I can write blogs directly using Notion. I would like to share my courses notes, paper notes, reading notes and projects on [my blog](https://richardsong.space). Welcome to visit it!🥳 <img src="https://github.com/RichardS0268/Blog/blob/main/public/cheer.gif", height=40px>

## Features

+ Sexy Appearance (Thanks to @[Travis Fischer](https://github.com/transitive-bullshit))
+ Global Search (Notion inner api)

+ Comment (Additional function based on [utterances](https://github.com/utterance/utterances)🔮) 

  + Only signed in github users can make comments

  + Background color (light or dark) changes synchronously with blogs


<table><tr>
<td><img src="https://github.com/RichardS0268/Blog/blob/main/public/comment_light.png" border=0></td>
<td><img src="https://github.com/RichardS0268/Blog/blob/main/public/comment_dark.png" border=0></td>
</tr></table>


## Fork

If you want a similar blog like mine. You can fork this repo and change some personal information (file or folder marked with ✍🏻
). You can follow the readme of  [nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit) to accomplish most of them. To enable the comment function, please construct a repo for comments and follow steps of [utterances' tutorial ](https://utteranc.es/)🔮. Then change the [line](https://github.com/RichardS0268/Blog/blob/main/components/NotionPage.tsx#:~:text=%3CReactUtterances-,repo%3D%7B%27user/repo%27%7D,-label%3D%7B) in `components/NotionPage.tsx` to your own repo. Good luck to you! 😁
