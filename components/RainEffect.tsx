import React, { useRef } from 'react'
import {Helmet} from 'react-helmet'

import styles from './styles.module.css'

export const RainEffect: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    return (
        <>
        <canvas ref={canvasRef} id="header_animation" width="100%" height="100%" className={styles.header_animation}></canvas>
        <Helmet>
        <script src="https://cpwebassets.codepen.io/assets/common/stopExecutionOnTimeout-8216c69d01441f36c0ea791ae2d4469f0f8ff5326f00ae2d00e4bb7d20e24edb.js"></script>  
        <script id="rendered-js" src="rainEffect.js"></script>
        </Helmet>
        </>
    )
  }
  