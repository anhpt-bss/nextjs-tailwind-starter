interface SkillCategory {
  title: string
  skills: string[]
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo'
}

interface SkillBadgeProps {
  category: SkillCategory
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  green:
    'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  purple:
    'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
  orange:
    'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
  pink: 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800',
  indigo:
    'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800',
}

export default function SkillBadge({ category }: SkillBadgeProps) {
  const colorClass = colorClasses[category.color || 'blue']

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50">
      <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-900 uppercase dark:text-slate-100">
        {category.title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill, index) => (
          <span
            key={index}
            className={`inline-block rounded-md border px-3 py-1.5 text-sm font-medium transition-all hover:scale-105 ${colorClass}`}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
