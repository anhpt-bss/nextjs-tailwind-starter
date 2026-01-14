import { Metadata } from 'next'

import CVContent from '@/components/cv/CVContent'
import { getCVData } from '@/data/cv'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params
  const cvData = getCVData(locale)

  return {
    title: `${cvData.personal.name} - ${cvData.personal.title}`,
    description: cvData.summary,
    openGraph: {
      title: `${cvData.personal.name} - ${cvData.personal.title}`,
      description: cvData.summary,
      type: 'profile',
    },
  }
}

export default function CVPage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const cvData = getCVData(locale)

  return <CVContent cvData={cvData} locale={locale} />
}
