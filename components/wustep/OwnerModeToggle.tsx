import { Bot } from 'lucide-react'
import { useRouter } from 'next/router'
import * as React from 'react'

import { useOwnerMode } from '@/components/wustep/OwnerModeProvider'
import { cn } from '@/lib/utils'

import styles from './OwnerModeToggle.module.css'

export function OwnerModeToggle({ className }: { className?: string }) {
  const router = useRouter()
  const { hasOwnerAccess, isOwner, setOwnerAccess, setOwnerMode } =
    useOwnerMode()
  const [isToggling, setIsToggling] = React.useState(false)

  if (!hasOwnerAccess) return null

  async function toggleOwnerMode() {
    if (isToggling) return

    if (isOwner) {
      setOwnerMode(false)
      return
    }

    setIsToggling(true)

    try {
      const response = await fetch('/api/owner-mode', {
        cache: 'no-store',
        credentials: 'same-origin'
      })
      const result = (await response.json()) as { isOwner?: boolean }

      if (response.ok && result.isOwner) {
        setOwnerMode(true)
        return
      }

      setOwnerAccess(false)
      await router.push('/owner')
    } catch {
      await router.push('/owner')
    } finally {
      setIsToggling(false)
    }
  }

  const label = isOwner ? 'Turn off owner mode' : 'Turn on owner mode'

  return (
    <button
      type='button'
      className={cn(
        styles.ownerModeToggle,
        isOwner && styles.active,
        className
      )}
      aria-busy={isToggling}
      aria-label={label}
      aria-pressed={isOwner}
      disabled={isToggling}
      title={label}
      onClick={toggleOwnerMode}
    >
      <Bot aria-hidden='true' />
      <span className={styles.statusDot} aria-hidden='true' />
    </button>
  )
}
