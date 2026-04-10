'use client'
import { Suspense } from 'react'
import CafeApp from './components/CafeApp'

export default function Home() {
  return (
    <Suspense fallback={null}>
      <CafeApp />
    </Suspense>
  )
}
