import ClientLayout from '@/layouts/ClientLayout'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Gallery', description: 'Gallery' })

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>
}
