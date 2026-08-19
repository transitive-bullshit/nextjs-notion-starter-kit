'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { twitter } from '@/lib/config'

import styles from './author-letter.module.css'

type SignatureState = 'armed' | 'complete' | 'visible'

const X_URL = `https://x.com/${twitter ?? 'transitive_bs'}`

export function AuthorLetter({ aboutHref }: { aboutHref: string }) {
  const signatureRef = useRef<HTMLElement>(null)
  const [signatureState, setSignatureState] =
    useState<SignatureState>('complete')

  useEffect(() => {
    const signature = signatureRef.current
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!signature || motionQuery.matches) return

    const bounds = signature.getBoundingClientRect()
    if (bounds.top <= window.innerHeight) return

    setSignatureState('armed')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return

        setSignatureState('visible')
        observer.disconnect()
      },
      { rootMargin: '0px 0px -64px 0px', threshold: 0.65 }
    )

    observer.observe(signature)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      className={styles.letter}
      id='author-letter'
      aria-labelledby='author-letter-title'
    >
      <div className={styles.inner}>
        <header className={styles.identity}>
          <a
            className={styles.avatarLink}
            href={X_URL}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={`Twitter @${twitter ?? 'transitive_bs'} (opens in a new tab)`}
          >
            <Image
              className={styles.avatar}
              src='/page-icon.png'
              alt='Travis Fischer'
              width={64}
              height={64}
            />
          </a>
          <p className={styles.kicker}>A note from the author</p>
        </header>

        <h2 className={styles.title} id='author-letter-title'>
          I build things, open-source the useful parts, and write down what
          survived.
        </h2>

        <div className={styles.body}>
          <p className={styles.lead}>
            I’m Travis Fischer—an engineer and entrepreneur working at the edge
            of AI, developer tools, and startups.
          </p>

          <p>
            This is where I unpack the work: what held up, what broke, and what
            I’d do differently next time. Expect code, strong opinions, and the
            occasional bit of transitive bullshit.
          </p>
        </div>

        <footer
          className={styles.signature}
          data-signature-state={signatureState}
          ref={signatureRef}
        >
          <span className={styles.visuallyHidden}>Signed, Travis Fischer</span>
          <svg
            className={styles.signatureArtwork}
            aria-hidden='true'
            focusable='false'
            viewBox='0 0 640 170'
          >
            <path
              className={`${styles.signatureStroke} ${styles.firstName}`}
              pathLength='1'
              d='M22 55c52-29 120-28 164-9M82 31c-8 30-20 65-14 90 4 18 22 7 35-10 13-18 18-34 20-43-6 24-12 45-6 54 7 11 21-2 29-19 5-12 6-14 3-2-4 21 1 31 12 25 12-7 20-28 25-35-5 20-2 35 9 35 13 0 22-21 27-33-3 16 0 29 9 31 11 2 21-20 23-28m0-18c2-2 4 1 2 3m-2 15c-3 16 1 28 11 28 14 0 23-23 27-30-5 14-5 25 3 30 10 7 28-5 27-16-1-8-10-9-16-4-6 7 4 20 26 15'
            />
            <path
              className={`${styles.signatureStroke} ${styles.lastName}`}
              pathLength='1'
              d='M349 46c34-21 77-19 105-6-33-7-67-1-83 14-14 14-20 39-17 63 3 19 16 20 29 6 14-15 20-37 22-56m-38 12c25-7 47-7 63-2m-18 19c-5 14-3 29 7 29 11 0 20-21 23-29m1-17c2-2 4 1 2 3m-3 14c-4 16 0 29 11 30 14 0 23-21 26-29-5 14-3 26 8 29 12 3 28-7 28-18 0-7-10-9-16-3-5 8 6 19 22 16 15-3 20-21 27-27-5 14-4 29 7 30 12 1 22-22 27-32-6 17-3 31 8 32 12 1 21-18 27-26'
            />
            <path
              className={`${styles.signatureStroke} ${styles.flourish}`}
              pathLength='1'
              d='M58 146c123 17 270 1 380-6 81-6 141 1 183-11'
            />
          </svg>

          <Link className={styles.aboutLink} href={aboutHref}>
            The longer version of me
            <span aria-hidden='true'>→</span>
          </Link>
        </footer>
      </div>
    </section>
  )
}
