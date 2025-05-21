import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Chem163() {
  const router = useRouter()

  useEffect(() => {
    router.push('/frontiers-in-biophysicschem163')
    window.location.href = '/frontiers-in-biophysicschem163'
  }, [router])

  return null
}
