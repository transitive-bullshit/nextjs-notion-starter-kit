import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Chem163() {
  const router = useRouter()

  useEffect(() => {
    router.push('/modern-atomic-and-optical-physics-iphysics285a')
    window.location.href = '/modern-atomic-and-optical-physics-iphysics285a'
  }, [])

  return null
}
