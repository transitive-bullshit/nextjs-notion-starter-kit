import Link from 'next/link'
import * as React from 'react'

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
          <Link
            key={project.url}
            href={project.url}
            className='group notion-collection-card relative flex h-full flex-col overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          >
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
          </Link>
        ))}
      </div>
    </PlaygroundLayout>
  )
}
