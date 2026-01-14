import { MapPin, Calendar, Briefcase } from 'lucide-react'

interface Experience {
  company: string
  position: string
  location: string
  duration: string
  type: string
  achievements: string[]
  technologies: string[]
}

interface ExperienceCardProps {
  experience: Experience
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="group relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50">
      {/* Timeline dot */}
      <div className="absolute top-8 -left-3 hidden h-6 w-6 rounded-full border-4 border-white bg-blue-600 shadow-md md:block dark:border-slate-900"></div>

      {/* Header */}
      <div className="mb-4">
        <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {experience.position}
          </h3>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            <Briefcase className="h-3 w-3" />
            {experience.type}
          </span>
        </div>

        <p className="mb-3 text-lg font-semibold text-blue-600 dark:text-blue-400">
          {experience.company}
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {experience.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {experience.duration}
          </span>
        </div>
      </div>

      {/* Achievements */}
      <ul className="mb-4 space-y-2 text-slate-700 dark:text-slate-300">
        {experience.achievements.map((achievement, index) => (
          <li key={index} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            <span className="flex-1">{achievement}</span>
          </li>
        ))}
      </ul>

      {/* Technologies */}
      <div className="flex flex-wrap gap-2">
        {experience.technologies.map((tech, index) => (
          <span
            key={index}
            className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
