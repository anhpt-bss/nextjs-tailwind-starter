import CVPage from '../../[locale]/cv/page'

export default function VietnameseCV() {
  return <CVPage params={{ locale: 'vi' }} />
}

export async function generateMetadata() {
  const { generateMetadata: getMetadata } = await import('../../[locale]/cv/page')
  return getMetadata({ params: { locale: 'vi' } })
}
