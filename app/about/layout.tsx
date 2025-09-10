import ClientLayout from '@/layouts/ClientLayout'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'About', description: 'About' })

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>
}
