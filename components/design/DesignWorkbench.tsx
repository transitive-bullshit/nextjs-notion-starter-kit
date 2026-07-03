import {
  Blocks,
  CheckCircle2,
  LayoutDashboard,
  LoaderCircle,
  type LucideIcon,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Share2,
  Type
} from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { cn } from '@/lib/utils'

import styles from './DesignWorkbench.module.css'

export type DesignToolId = 'fonts' | 'blocks' | 'social' | 'theme'

const tools: Array<{
  id: DesignToolId
  label: string
  href: string
  icon: LucideIcon
}> = [
  { id: 'fonts', label: 'Fonts', href: '/design/fonts', icon: Type },
  { id: 'blocks', label: 'Blocks', href: '/design/blocks', icon: Blocks },
  { id: 'social', label: 'Social', href: '/design/social', icon: Share2 },
  { id: 'theme', label: 'Theme', href: '/design/theme', icon: Palette }
]

export function DesignWorkbenchNav({
  activeTool,
  status = 'Ready'
}: {
  activeTool: DesignToolId
  status?: string
}) {
  const isLoading = status.toLowerCase().includes('loading')
  const StatusIcon = isLoading ? LoaderCircle : CheckCircle2

  return (
    <header className={styles.nav}>
      <Link href='/design' className={styles.brand}>
        <LayoutDashboard aria-hidden='true' />
        <span>Workbench</span>
      </Link>
      <nav className={styles.toolNav} aria-label='Design tools'>
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Link
              key={tool.id}
              href={tool.href}
              className={cn(
                styles.toolLink,
                tool.id === activeTool && styles.activeTool
              )}
              aria-current={tool.id === activeTool ? 'page' : undefined}
            >
              <Icon aria-hidden='true' />
              <span>{tool.label}</span>
            </Link>
          )
        })}
      </nav>
      <div
        className={cn(styles.status, isLoading && styles.loadingStatus)}
        role='status'
      >
        <StatusIcon aria-hidden='true' />
        <span>{status}</span>
      </div>
    </header>
  )
}

export function DesignWorkbench({
  activeTool,
  title,
  description,
  controls,
  controlsFooter,
  toolbar,
  children,
  status,
  stageClassName
}: {
  activeTool: DesignToolId
  title: string
  description: string
  controls: React.ReactNode
  controlsFooter?: React.ReactNode
  toolbar?: React.ReactNode
  children: React.ReactNode
  status?: string
  stageClassName?: string
}) {
  const [panelOpen, setPanelOpen] = React.useState(true)

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanelOpen(false)
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div className={styles.workbench}>
      <DesignWorkbenchNav activeTool={activeTool} status={status} />
      <div className={cn(styles.body, !panelOpen && styles.panelClosed)}>
        <aside className={styles.panel} aria-label={`${title} controls`}>
          <div className={styles.panelHeader}>
            <div>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
            <button
              type='button'
              className={styles.iconButton}
              onClick={() => setPanelOpen(false)}
              aria-label='Close controls'
            >
              <PanelLeftClose aria-hidden='true' />
            </button>
          </div>
          <div className={styles.controls}>{controls}</div>
          {controlsFooter && (
            <div className={styles.controlsFooter}>{controlsFooter}</div>
          )}
        </aside>

        <main className={cn(styles.stage, stageClassName)}>
          <div className={styles.toolbar}>
            {!panelOpen && (
              <button
                type='button'
                className={styles.stageIconButton}
                onClick={() => setPanelOpen(true)}
                aria-label='Open controls'
              >
                <PanelLeftOpen aria-hidden='true' />
              </button>
            )}
            {toolbar}
          </div>
          <div className={styles.canvas}>{children}</div>
        </main>
        <button
          type='button'
          className={styles.backdrop}
          onClick={() => setPanelOpen(false)}
          aria-label='Close controls'
          tabIndex={panelOpen ? 0 : -1}
        />
      </div>
    </div>
  )
}
