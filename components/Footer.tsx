import * as React from 'react'
import styles from './styles.module.css'

export const Footer: React.FC = () => {
  return (
    <>
      <footer className={styles.footerContainer}>
        {/* Top section with columns */}
        <div className={styles.footerColumns}>
          <div className={styles.footerTop}>
            <h2>A free and open archive of 
            Harvard & MIT course materials</h2>
            {/* Styled form for input with button */}
            {/* Styled form for input with button */}
            <form className={styles.footerForm}>
              <input 
                type="text" 
                placeholder="Request a Course..." 
                className={styles.footerInput}
              />
              <button type="submit" className={styles.footerButton}>
                {/* arrow icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                  <path d="M17.5303 10.4453L11.9053 16.0703C11.7853 16.1849 11.6259 16.2492 11.46 16.2499C11.377 16.2496 11.2949 16.2337 11.2178 16.2031C11.104 16.1553 11.007 16.0748 10.9388 15.972C10.8707 15.8691 10.8346 15.7483 10.835 15.6249V10.6249H3.33496C3.1692 10.6249 3.01023 10.5591 2.89302 10.4419C2.77581 10.3247 2.70996 10.1657 2.70996 9.99994C2.70996 9.83418 2.77581 9.67521 2.89302 9.558C3.01023 9.44079 3.1692 9.37494 3.33496 9.37494H10.835V4.37494C10.8346 4.25155 10.8707 4.1308 10.9388 4.02792C11.007 3.92504 11.104 3.84463 11.2178 3.79681C11.3332 3.75179 11.4591 3.74036 11.5807 3.76387C11.7024 3.78737 11.8149 3.84484 11.9053 3.92963L17.5303 9.55463C17.6476 9.67312 17.7135 9.83316 17.7135 9.99994C17.7135 10.1667 17.6476 10.3268 17.5303 10.4453V10.4453Z" fill="#111928"/>
                </svg>
              </button>
            </form>
          </div>
          <div className={styles.footerRow}>
            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>Math</div>
              <div>Mathematical Biology-Evolutionary</div>
              <div>Dynamics</div>
            </div>

            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>Science</div>
              <div>Mathematical Biology-Evolutionary</div>
              <div>Dynamics</div>
            </div>

            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>Math</div>
              <div>Mathematical Biology-Evolutionary</div>
              <div>Dynamics</div>
            </div>

            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>English</div>
              <div>Mathematical Biology-Evolutionary</div>
              <div>Dynamics</div>
            </div>
          </div>
        </div>

        {/* Bottom strip with brand on left and links on right */}
        <div className={styles.footerBottom}>
          <div className={styles.footerBottomLeft}>CourseTexts</div>
          <div className={styles.footerLinks}>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">NCA License</a>
          </div>
        </div>
      </footer>

    </>
  )
}
