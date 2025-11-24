// eslint-disable-next-line simple-import-sort/imports
import * as React from 'react'
import Image from 'next/image'

import { FaEnvelopeOpenText } from '@react-icons/all-files/fa/FaEnvelopeOpenText'
import { FaGithub } from '@react-icons/all-files/fa/FaGithub'
import { FaLinkedin } from '@react-icons/all-files/fa/FaLinkedin'
import { FaMastodon } from '@react-icons/all-files/fa/FaMastodon'
import { FaYoutube } from '@react-icons/all-files/fa/FaYoutube'
import { FaZhihu } from '@react-icons/all-files/fa/FaZhihu'
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp'
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline'

// Using react-icons for the new social platforms
import { FaXTwitter } from 'react-icons/fa6'
import { FaDiscord, FaFacebook, FaInstagram } from 'react-icons/fa'

import * as config from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'

import styles from './styles.module.css'

// TODO: merge the data and icons from PageSocial with the social links in Footer

export function FooterImpl() {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const currentYear = new Date().getFullYear()

  const onToggleDarkMode = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      toggleDarkMode()
    },
    [toggleDarkMode]
  )

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <>
      {/* TOP FOOTER NAV BAND */}
      <div className={styles.footerNav}>
        <div className={styles.footerNavInner}>
          {/* Logo / Studio mark */}
          <div className={styles.footerNavLogo}>
            <a href='/' aria-label={`${config.name} home`}>
              {/* Light-mode logo (blue) */}
              <Image
                src='/open almond logo plain blue.svg'
                alt='Open Almond Studios logo'
                className={`${styles.footerNavLogoImage} ${styles.lightModeLogo}`}
                width={72}
                height={72}
              />
              {/* Dark-mode logo (plain) */}
              <Image
                src='/open almond logo plain.svg'
                alt='Open Almond Studios logo'
                className={`${styles.footerNavLogoImage} ${styles.darkModeLogo}`}
                width={72}
                height={72}
              />
            </a>
          </div>

          {/* Two columns of footer nav links */}
          <div className={styles.footerNavColumns}>
            <div className={styles.footerNavColumn}>
              <a href='/about-the-studio' className={styles.footerNavLink}>
                About the Studio
              </a>
              <a href='/contact-us' className={styles.footerNavLink}>
                Contact Us
              </a>
              <a href='/customer-service' className={styles.footerNavLink}>
                Customer Service
              </a>
            </div>

            <div className={styles.footerNavColumn}>
              <a href='/terms-of-use' className={styles.footerNavLink}>
                Terms of Use
              </a>
              <a href='/privacy-policy' className={styles.footerNavLink}>
                Privacy Policy
              </a>
              <a href='/licensing' className={styles.footerNavLink}>
                Licensing
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* LOWER FOOTER STRIP (copyright + dark mode + socials) */}
      <footer className={styles.footer}>
        {/* COPYRIGHT */}
        <div className={styles.copyright}>
          © {currentYear} {config.author}. All Rights Reserved.
        </div>

        {/* DARK MODE TOGGLE */}
        <div className={styles.settings}>
          {hasMounted && (
            <a
              className={styles.toggleDarkMode}
              href='#'
              role='button'
              onClick={onToggleDarkMode}
              title='Toggle dark mode'
            >
              {isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
            </a>
          )}
        </div>

        {/* SOCIAL ICONS */}
        <div className={styles.social}>
          {config.twitter && (
            <a
              className={styles.twitter}
              href={`https://x.com/${config.twitter}`}
              title={`X (Twitter) @${config.twitter}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaXTwitter />
            </a>
          )}

          {config.mastodon && (
            <a
              className={styles.mastodon}
              href={config.mastodon}
              title={`Mastodon ${config.getMastodonHandle()}`}
              rel='me'
            >
              <FaMastodon />
            </a>
          )}

          {config.zhihu && (
            <a
              className={styles.zhihu}
              href={`https://zhihu.com/people/${config.zhihu}`}
              title={`Zhihu @${config.zhihu}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaZhihu />
            </a>
          )}

          {config.github && (
            <a
              className={styles.github}
              href={`https://github.com/${config.github}`}
              title={`GitHub @${config.github}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaGithub />
            </a>
          )}

          {config.discord && (
            <a
              className={styles.discord}
              href={config.discord}
              title='Discord'
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaDiscord />
            </a>
          )}

          {config.facebook && (
            <a
              className={styles.facebook}
              href={config.facebook}
              title='Facebook'
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaFacebook />
            </a>
          )}

          {config.instagram && (
            <a
              className={styles.instagram}
              href={config.instagram}
              title='Instagram'
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaInstagram />
            </a>
          )}

          {config.linkedin && (
            <a
              className={styles.linkedin}
              href={`https://www.linkedin.com/company/${config.linkedin}`}
              title={`LinkedIn ${config.author}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaLinkedin />
            </a>
          )}

          {config.newsletter && (
            <a
              className={styles.newsletter}
              href={config.newsletter}
              title={`Newsletter ${config.author}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaEnvelopeOpenText />
            </a>
          )}

          {config.youtube && (
            <a
              className={styles.youtube}
              href={`https://www.youtube.com/${config.youtube}`}
              title={`YouTube ${config.author}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaYoutube />
            </a>
          )}
        </div>
      </footer>
    </>
  )
}

export const Footer = React.memo(FooterImpl)
