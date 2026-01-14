import { Award, Calendar } from 'lucide-react'

interface Project {
  name: string
  description: string
  role: string
  technologies: string[]
  achievements: string[]
  year: string
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:from-slate-800/50 dark:to-slate-800/30">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-slate-100">
            {project.name}
          </h3>
          <p className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">
            {project.role}
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
          <Calendar className="h-3 w-3" />
          {project.year}
        </span>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {project.description}
      </p>

      {/* Key Achievements */}
      <div className="mb-4 flex flex-wrap gap-2">
        {project.achievements.map((achievement, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
          >
            <Award className="h-3 w-3" />
            {achievement}
          </span>
        ))}
      </div>

      {/* Technologies */}
      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech, index) => (
          <span
            key={index}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
