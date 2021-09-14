import React from "react"
import {Carousel} from "react-responsive-carousel"
import WreathCountdown from "./wreath-countdown"
import BeachBlitzCarousel from "./beach-blitz-carousel"


var HomepageCarousel = () => {
        return (
            <React.Lazy>
            <div style={{height:"100%", width:"100%"}}>
            <Carousel showThumbs={false}>
                <div>
                    <WreathCountdown ></WreathCountdown>
                </div>
                <div><BeachBlitzCarousel></BeachBlitzCarousel></div>
                
            </Carousel></div></React.Lazy>
        );
    }
;
export default HomepageCarousel;

// Don't forget to include the css in your page 
// <link rel="stylesheet" href="carousel.css"/>
// Begin DemoSliderControls