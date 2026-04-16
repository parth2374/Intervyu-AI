'use client'

import { useAuthContext } from '@/app/provider'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const AuthRedirectHandler = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuthContext()

  const redirectUrl = searchParams.get('redirect') || '/dashboard'

  useEffect(() => {
    if (user) {
      router.push(redirectUrl)
    }
  }, [user, redirectUrl, router])

  return null
}

export default AuthRedirectHandler