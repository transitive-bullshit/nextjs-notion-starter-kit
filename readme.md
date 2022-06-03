# Blog

## Description

The repo is forked from [nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit). Thanks to @[Travis Fischer](https://github.com/transitive-bullshit), I constructed my personal blog successfully even if I barely know `React` and  `TypeScript`.

The repo uses api of [Notion](https://www.notion.so), thus I can write blogs directly using Notion. I would like to share my courses notes, paper notes, reading notes and projects on [my blog](https://richardsong.space). Welcome to visit it!🥳

## Features

+ Sexy Appearance (Thanks to @[Travis Fischer](https://github.com/transitive-bullshit))
+ Global Search [Notion inner api)

+ Comment (Additional function based on [utterances](https://github.com/utterance/utterances)🔮) 

  + Only signed in github users can make comments

  + Background color (dark or light) changes synchronously with blogs

    ```html
      <div align="mid">
      <img src="https://github.com/RichardS0268/Blog/blob/main/public/1.png">
      <img src="https://github.com/RichardS0268/Blog/blob/main/public/2.png">
      </div>
    ```

## Fork

If you want a similar blog like mine. You can fork this repo and change some personal information (links). You can follow the readme of  [nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit) to accomplish most of them. To enable the comment function, please construct a repo for comments and follow steps of 🔮[utterances' tutorial ](https://utteranc.es/). Then change the file `components/NotionPage.tsx` and change the [line](https://github.com/RichardS0268/Blog/blob/main/components/NotionPage.tsx#:~:text=repo%3D%7B%27RichardS0268/BlogFeedback%27%7D) with your own repo. Good luck to you! 😁

