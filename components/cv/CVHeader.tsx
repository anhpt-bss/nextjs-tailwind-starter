import { Mail, MapPin, Phone, Globe, Linkedin, Calendar } from 'lucide-react'

import { CVData } from '@/data/cv/en'

interface CVHeaderProps {
  data: CVData['personal']
}

export default function CVHeader({ data }: CVHeaderProps) {
  return (
    <header className="mb-12 border-b border-slate-200 pb-10 dark:border-slate-700">
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
        {/* Avatar */}
        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-lg ring-4 ring-slate-100 dark:from-blue-900/30 dark:to-indigo-900/30 dark:ring-slate-800">
          <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-blue-600 dark:text-blue-400">
            {data.name.charAt(0)}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl dark:text-slate-100">
            {data.name}
          </h1>
          <p className="mb-1 text-xl font-medium text-blue-600 dark:text-blue-400">{data.title}</p>
          <p className="mb-6 text-lg text-slate-600 dark:text-slate-400">{data.subtitle}</p>

          {/* Contact Info */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ContactItem icon={<Calendar className="h-4 w-4" />} text={data.dateOfBirth} />
            <ContactItem
              icon={<Mail className="h-4 w-4" />}
              text={data.email}
              href={`mailto:${data.email}`}
            />
            <ContactItem
              icon={<Phone className="h-4 w-4" />}
              text={data.phone}
              href={`tel:${data.phone.replace(/\s/g, '')}`}
            />
            <ContactItem
              icon={<Linkedin className="h-4 w-4" />}
              text={data.linkedin.replace('linkedin.com/in/', '')}
              href={`https://${data.linkedin}`}
            />
            <ContactItem
              icon={<Globe className="h-4 w-4" />}
              text={data.website.replace('https://', '')}
              href={data.website}
            />
            <ContactItem icon={<MapPin className="h-4 w-4" />} text={data.location} />
          </div>
        </div>
      </div>
    </header>
  )
}

function ContactItem({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) {
  const content = (
    <>
      <span className="flex-shrink-0 text-slate-400 dark:text-slate-500">{icon}</span>
      <span className="truncate text-sm text-slate-700 dark:text-slate-300">{text}</span>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
      >
        {content}
      </a>
    )
  }

  return <div className="flex items-center gap-2">{content}</div>
}
