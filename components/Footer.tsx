import * as React from 'react'
import { useState } from 'react'

import { discord, donate, github, twitter } from '@/lib/config'

import { DiscordIcon, GithubIcon, TwitterXIcon } from './custom-icons'
import styles from './styles.module.css'

export const Footer: React.FC = () => {
  // --- form logic integration ------------------------------------------------
  const [topic, setTopic] = useState('')
  const [status, setStatus] = useState<'success' | 'error' | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus(null)

    try {
      const response = await fetch('/api/append-to-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      })

      const result = await response.json()

      if (response.ok) {
        setStatus('success')
        setTopic('')
      } else {
        throw new Error(result.message || 'Error appending to sheet')
      }
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }
  // ---------------------------------------------------------------------------

  return (
    <>
      <footer className={styles.footerContainer}>
        {/* Top section with columns */}
        <div className={styles.footerColumns}>
          <div className={styles.footerTop}>
            <h2>
              A free and open archive of
              <br /> Harvard & MIT course materials
            </h2>
            {/* Styled form for input with button */}
            <div>
              <form className={styles.footerForm} onSubmit={handleSubmit}>
                <input
                  type='text'
                  placeholder='Request a Course...'
                  className={styles.footerInput}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />

                <button type='submit' className={styles.footerButton}>
                  {/* arrow icon */}
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='21'
                    height='20'
                    viewBox='0 0 21 20'
                    fill='none'
                  >
                    <path
                      d='M17.5303 10.4453L11.9053 16.0703C11.7853 16.1849 11.6259 16.2492 11.46 16.2499C11.377 16.2496 11.2949 16.2337 11.2178 16.2031C11.104 16.1553 11.007 16.0748 10.9388 15.972C10.8707 15.8691 10.8346 15.7483 10.835 15.6249V10.6249H3.33496C3.1692 10.6249 3.01023 10.5591 2.89302 10.4419C2.77581 10.3247 2.70996 10.1657 2.70996 9.99994C2.70996 9.83418 2.77581 9.67521 2.89302 9.558C3.01023 9.44079 3.1692 9.37494 3.33496 9.37494H10.835V4.37494C10.8346 4.25155 10.8707 4.1308 10.9388 4.02792C11.007 3.92504 11.104 3.84463 11.2178 3.79681C11.3332 3.75179 11.4591 3.74036 11.5807 3.76387C11.7024 3.78737 11.8149 3.84484 11.9053 3.92963L17.5303 9.55463C17.6476 9.67312 17.7135 9.83316 17.7135 9.99994C17.7135 10.1667 17.6476 10.3268 17.5303 10.4453V10.4453Z'
                      fill='#111928'
                    />
                  </svg>
                </button>
              </form>

              {/* status messages */}
              {status === 'success' && (
                <p style={{ color: 'lightgreen', marginTop: '0.5rem' }}>
                  Your request has been submitted!
                </p>
              )}
              {status === 'error' && (
                <p style={{ color: 'red', marginTop: '0.5rem' }}>
                  Sorry, there was an error. Please try again.
                </p>
              )}
            </div>
          </div>

          <div className={styles.footerRow}>
            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>Math</div>
              <a href='/mathematical-biology-evolutionary-dynamics-math-242-dff30cb6404848a4bf2bf4d0ba385c46'>
                Mathematical Biology-Evolutionary Dynamics
              </a>
              <a href='/automorphic-forms-and-arithmetic-statistics-math-288x-12d19a13312a8066bbd8dc21cfee3969'>
                Automorphic Forms and Arithmetic Statistics
              </a>
              <a href='/vector-calculus-and-linear-algebra-ii-math-22b-12d19a13312a8096ad91cf37d6973355'>
                Vector Calculus and Linear Algebra II
              </a>
              <a href='/differential-geometry-math230a-12d19a13312a8028b457f080d389cd06'>
                Differential Geometry
              </a>
              <a href='/mathematics-and-the-world-math-157-12b19a13312a807ea697ffc87aab9f0d'>
                Mathematics and the World
              </a>
              <a href='/algebraic-geometry-math137-9991b187ee4d4e66a900e4462dbd59c4'>
                Algebraic Geometry
              </a>
            </div>

            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>Physics</div>
              <a href='/advanced-electromagnetismphysics-232-d82e8352f9b24e738aa57720d06e8995'>
                Advanced Electromagnetism
              </a>
              <a href='/modern-atomic-and-optical-physics-iphysics285a-4aeba2df8c1241ae9c7703c3d1d4ab63'>
                Modern Atomic and Optical Physics I
              </a>
              <a href='/frontiers-in-biophysicschem163-153883e7e7094a2e8473b7c626b8aa58'>
                Frontiers in Biophysics
              </a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.footerBottomLeft}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                d='M21.9 18.3373L18.0187 3.84358C17.9155 3.45947 17.6639 3.13208 17.3194 2.93341C16.9748 2.73475 16.5654 2.68108 16.1813 2.78421L13.2844 3.56233L13.1906 3.59046C13.0509 3.40715 12.8708 3.25851 12.6643 3.15608C12.4578 3.05365 12.2305 3.00018 12 2.99983H9C8.73609 3.00054 8.47716 3.07175 8.25 3.20608C8.02284 3.07175 7.76391 3.00054 7.5 2.99983H4.5C4.10218 2.99983 3.72064 3.15787 3.43934 3.43917C3.15804 3.72048 3 4.10201 3 4.49983V19.4998C3 19.8977 3.15804 20.2792 3.43934 20.5605C3.72064 20.8418 4.10218 20.9998 4.5 20.9998H7.5C7.76391 20.9991 8.02284 20.9279 8.25 20.7936C8.47716 20.9279 8.73609 20.9991 9 20.9998H12C12.3978 20.9998 12.7794 20.8418 13.0607 20.5605C13.342 20.2792 13.5 19.8977 13.5 19.4998V10.1623L16.1063 19.8842C16.1912 20.2046 16.3798 20.4878 16.6427 20.6896C16.9056 20.8915 17.2279 21.0005 17.5594 20.9998C17.6888 20.9976 17.8176 20.9819 17.9437 20.953L20.8406 20.1748C21.2247 20.0716 21.5521 19.82 21.7508 19.4754C21.9495 19.1309 22.0031 18.7215 21.9 18.3373V18.3373ZM16.5656 4.23733L17.1562 6.40296L14.2594 7.18108L13.6688 5.01546L16.5656 4.23733ZM12 4.49983V15.7498H9V4.49983H12ZM7.5 4.49983V6.74983H4.5V4.49983H7.5ZM12 19.4998H9V17.2498H12V19.4998ZM20.4562 18.7217L17.5594 19.4998L16.9688 17.3248L19.875 16.5467L20.4562 18.7217Z'
                fill='white'
              />
            </svg>
            CourseTexts
          </div>
          <div className={styles.footerBottomRight}>
            <div className={styles.footerLinks}>
              <a href={donate} target='_blank' rel='noreferrer'>
                Donate
              </a>
              <a href='/terms-of-service'>Terms of Service</a>
              <a href='/privacy-policy'>Privacy Policy</a>
            </div>
            <div className={styles.footerSocials}>
              <a href={discord} target='_blank' rel='noreferrer'>
                <DiscordIcon />
              </a>
              <a href={twitter} target='_blank' rel='noreferrer'>
                <TwitterXIcon />
              </a>
              <a href={github} target='_blank' rel='noreferrer'>
                <GithubIcon />
              </a>
            </div>
          </div>
        </div>

        {/* License notice */}
        <div className={styles.footerLicense}>
          <p>
            Except where otherwise noted, content on this site is licensed under
            a{' '}
            <a
              href='https://creativecommons.org/licenses/by/4.0/'
              target='_blank'
              rel='noreferrer'
            >
              Creative Commons Attribution 4.0 License
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}
