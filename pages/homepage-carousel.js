import React from "react"
import {Carousel} from "react-responsive-carousel"
import WreathCountdown from "./wreath-countdown"


var HomepageCarousel = () => {
        return (
            <Carousel>
                <div>
                    <WreathCountdown></WreathCountdown>
                </div>
                <div><img src="/ScorpionSquare.jpg"></img></div>
                
            </Carousel>
        );
    }
;
export default HomepageCarousel;

// Don't forget to include the css in your page 
// <link rel="stylesheet" href="carousel.css"/>
// Begin DemoSliderControls