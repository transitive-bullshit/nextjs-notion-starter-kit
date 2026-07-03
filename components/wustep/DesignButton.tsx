import { PencilRuler } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { cn } from '@/lib/utils'

import styles from './DesignButton.module.css'

export function DesignButton({ className }: { className?: string }) {
  const [isLocalhost, setIsLocalhost] = React.useState(false)

  React.useEffect(() => {
    setIsLocalhost(
      ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
    )
  }, [])

  if (!isLocalhost) return null

  return (
    <Link
      href='/design'
      className={cn(styles.designButton, className)}
      aria-label='Open local design workbench'
      title='Open local design workbench'
    >
      <PencilRuler aria-hidden='true' />
    </Link>
  )
}
