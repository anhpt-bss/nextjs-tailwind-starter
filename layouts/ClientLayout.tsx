import React from 'react'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'

interface LayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className="mb-auto">
        <SectionContainer>{children}</SectionContainer>
      </main>
      <Footer />
    </>
  )
}
