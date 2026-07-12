import { Newspaper } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { RiTwitterX } from '@/components/icons/InlineIcons'
import { useOwnerMode } from '@/components/wustep/OwnerModeProvider'
import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'
import { useInView } from '@/lib/use-in-view'
import { playgroundEntries } from '@/playground/registry'

/**
 * Cover cell that pauses its (looping) CSS animations while scrolled
 * off-screen — several covers run infinite keyframes, and phones shouldn't
 * pay for paints nobody sees. animation-play-state (see globals.css)
 * preserves each animation's position instead of restarting it.
 */
function CoverCell({ children }: { children: React.ReactNode }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0, once: false })
  return (
    <div
      ref={ref}
      data-animations-paused={inView ? undefined : ''}
      className='notion-collection-card-cover aspect-video w-full [content-visibility:auto]'
    >
      {children}
    </div>
  )
}

/* Quiet chip for the card's quick links; sits above the stretched card link
   so it stays clickable, and brightens on its own hover. */
const quickLinkClass =
  'flex size-7 items-center justify-center rounded-full border border-border/60 bg-background/75 text-muted-foreground backdrop-blur-sm transition-colors hover:border-border hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'

const parseDate = (dateStr?: string): Date => {
  if (!dateStr) return new Date(0)
  const [month, year] = dateStr.split(' ')
  if (!year) return new Date(0)
  const monthIndex = new Date(`${month} 1, 2000`).getMonth()
  return new Date(Number.parseInt(year), monthIndex)
}

export default function PlaygroundPage() {
  const { isOwner } = useOwnerMode()
  const projects = React.useMemo(
    () =>
      playgroundEntries
        .filter(
          (project) => !project.disabled && (!project.ownerOnly || isOwner)
        )
        .toSorted(
          (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
        ),
    [isOwner]
  )

  return (
    <PlaygroundLayout title='Playground'>
      <p className='text-muted-foreground mb-8'>
        A collection of interactive experiments, demos, and creative projects.
      </p>

      <div className='grid gap-6 md:grid-cols-2'>
        {projects.map((project) => (
          <div
            key={project.url}
            className='group notion-collection-card relative flex h-full flex-col overflow-hidden'
          >
            {/* Stretched link makes the whole card clickable while leaving
                room for sibling quick links (article/X) layered above it —
                a nested <a> inside the card link would be invalid HTML. */}
            <Link
              href={project.url}
              aria-label={project.title}
              className='absolute inset-0 z-[1] rounded-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            />
            <CoverCell>
              {project.CoverComponent ? (
                <project.CoverComponent />
              ) : project.image ? (
                <img
                  src={project.image}
                  alt={`${project.title} cover`}
                  loading='lazy'
                  className='h-full w-full object-cover transition-transform duration-[250ms] ease-out'
                />
              ) : (
                <div
                  className={`h-full w-full bg-linear-to-br ${
                    project.gradient ?? 'from-slate-700 to-slate-900'
                  }`}
                />
              )}
            </CoverCell>
            <div className='notion-collection-card-body p-4 flex-1'>
              <h3 className='font-semibold mb-1'>{project.title}</h3>
              <p className='text-sm text-muted-foreground'>
                {project.summary ?? project.description}
              </p>
            </div>
            {project.article || project.x ? (
              <div className='absolute right-2.5 top-2.5 z-[2] flex gap-1.5'>
                {project.article ? (
                  <Link
                    href={project.article}
                    aria-label={`${project.title} — read the article`}
                    title='Read the article'
                    className={quickLinkClass}
                  >
                    <Newspaper className='size-[15px]' aria-hidden='true' />
                  </Link>
                ) : null}
                {project.x ? (
                  <a
                    href={project.x}
                    target='_blank'
                    rel='noreferrer'
                    aria-label={`${project.title} — view the post on X`}
                    title='View the post on X'
                    className={quickLinkClass}
                  >
                    <RiTwitterX size={13} aria-hidden='true' />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </PlaygroundLayout>
  )
}
