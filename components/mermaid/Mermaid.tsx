import React, { useEffect } from 'react'

import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  // Inspired by https://codesandbox.io/s/react-with-mermaid-ex9f7?file=/src/Mermaid.js:0-1276
  // themeCSS: `
  //   g.classGroup rect {
  //     fill: #282a36;
  //     stroke: #6272a4;
  //   }
  //   g.classGroup text {
  //     fill: #f8f8f2;
  //   }
  //   g.classGroup line {
  //     stroke: #f8f8f2;
  //     stroke-width: 0.5;
  //   }
  //   .messageLine0 {
  //     stroke-color: #fff
  //   }
  //   .classLabel .box {
  //     stroke: #21222c;
  //     stroke-width: 3;
  //     fill: #21222c;
  //     opacity: 1;
  //   }
  //   .classLabel .label {
  //     fill: #f1fa8c;
  //   }
  //   .relation {
  //     stroke: #ff79c6;
  //     stroke-width: 1;
  //   }
  //   #compositionStart, #compositionEnd {
  //     fill: #bd93f9;
  //     stroke: #bd93f9;
  //     stroke-width: 1;
  //   }
  //   #aggregationEnd, #aggregationStart {
  //     fill: #21222c;
  //     stroke: #50fa7b;
  //     stroke-width: 1;
  //   }
  //   #dependencyStart, #dependencyEnd {
  //     fill: #00bcd4;
  //     stroke: #00bcd4;
  //     stroke-width: 1;
  //   }
  //   #extensionStart, #extensionEnd {
  //     fill: #f8f8f2;
  //     stroke: #f8f8f2;
  //     stroke-width: 1;
  //   }`,
  fontFamily: 'Fira Code'
})

type Props = {
  chart: string
}

export const Mermaid = (props: Props) => {
  useEffect(() => {
    mermaid.contentLoaded()
  }, [])

  return <div className='mermaid mermaid-container'>{props.chart}</div>
}
