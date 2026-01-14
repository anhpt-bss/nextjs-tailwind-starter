import CVPage from '../../[locale]/cv/page'

export default function EnglishCV() {
  return <CVPage params={{ locale: 'en' }} />
}

export async function generateMetadata() {
  const { generateMetadata: getMetadata } = await import('../../[locale]/cv/page')
  return getMetadata({ params: { locale: 'en' } })
}
