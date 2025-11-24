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
import { FaDiscord, FaFacebook, FaInstagram } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

import * as config from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'

import styles from './styles.module.css'

// TODO: merge the data and icons from PageSocial with the social links in Footer

export function FooterImpl() {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const currentYear = new Date().getFullYear()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  const onToggleDarkMode = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      toggleDarkMode()
    },
    [toggleDarkMode]
  )

  return (
    <>
     {/* TOP FOOTER NAV BAND */}
      <div className={styles.footerNav}>
        <div className={styles.footerNavInner}>
          {/* Logo block */}
          <div className={styles.footerNavLogo}>
            <a href='/' aria-label={`${config.name} home`}>
              {hasMounted && (
                <Image
                  src={
                    isDarkMode
                      ? '/open-almond-logo-plain.svg'
                      : '/open-almond-logo-plain-blue.svg'
                  }
                  alt='Open Almond Studios logo'
                  width={72}
                  height={72}
                  className={styles.footerNavLogoImage}
                />
              )}
            </a>
          </div>

          {/* Two columns of links */}
          <div className={styles.footerNavColumns}>
            <ul className={styles.footerNavColumn}>
              <li>
                <a href='/about-the-studio' className={styles.footerNavLink}>
                  About the Studio
                </a>
              </li>
              <li>
                <a href='/contact-us' className={styles.footerNavLink}>
                  Contact Us
                </a>
              </li>
              <li>
                <a href='/customer-service' className={styles.footerNavLink}>
                  Customer Service
                </a>
              </li>
            </ul>

            <ul className={styles.footerNavColumn}>
              <li>
                <a href='/terms-of-use' className={styles.footerNavLink}>
                  Terms of Use
                </a>
              </li>
              <li>
                <a href='/privacy-policy' className={styles.footerNavLink}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href='/licensing' className={styles.footerNavLink}>
                  Licensing
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* LOWER FOOTER STRIP */}
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
