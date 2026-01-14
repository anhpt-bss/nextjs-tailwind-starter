'use client'

import {
  Award,
  Briefcase,
  Code2,
  FileText,
  GraduationCap,
  Heart,
  Languages,
  Rocket,
} from 'lucide-react'

import CVHeader from '@/components/cv/CVHeader'
import CVSection from '@/components/cv/CVSection'
import DownloadPDFButton from '@/components/cv/DownloadPDFButton'
import ExperienceCard from '@/components/cv/ExperienceCard'
import ProjectCard from '@/components/cv/ProjectCard'
import SkillBadge from '@/components/cv/SkillBadge'
import { CVData } from '@/data/cv/en'

interface CVContentProps {
  cvData: CVData
  locale: string
}

export default function CVContent({ cvData, locale }: CVContentProps) {
  const isVietnamese = locale === 'vi'

  // Translations
  const t = {
    download: isVietnamese ? 'Tải PDF' : 'Download PDF',
    summary: isVietnamese ? 'Tóm Tắt' : 'Summary',
    skills: isVietnamese ? 'Kỹ Năng' : 'Skills',
    experience: isVietnamese ? 'Kinh Nghiệm Làm Việc' : 'Work Experience',
    projects: isVietnamese ? 'Dự Án Nổi Bật' : 'Notable Projects',
    education: isVietnamese ? 'Học Vấn' : 'Education',
    certifications: isVietnamese ? 'Chứng Chỉ' : 'Certifications',
    languages: isVietnamese ? 'Ngôn Ngữ' : 'Languages',
    interests: isVietnamese ? 'Sở Thích' : 'Interests',
    switchLang: isVietnamese ? 'English Version' : 'Phiên bản Tiếng Việt',
    skillCategories: {
      frontend: isVietnamese ? 'Frontend' : 'Frontend',
      styling: isVietnamese ? 'Styling & CSS' : 'Styling & CSS',
      stateManagement: isVietnamese ? 'Quản Lý State' : 'State Management',
      tools: isVietnamese ? 'Công Cụ & DevOps' : 'Tools & DevOps',
      testing: isVietnamese ? 'Testing' : 'Testing',
      backend: isVietnamese ? 'Backend' : 'Backend',
      others: isVietnamese ? 'Khác' : 'Others',
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800">
      {/* Language Switch & Download Button */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 sm:flex-row print:hidden">
        <a
          href={`/${locale === 'vi' ? 'en' : 'vi'}/cv`}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{t.switchLang}</span>
        </a>
        <DownloadPDFButton label={t.download} />
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          id="cv-content"
          className="rounded-2xl bg-white p-8 shadow-xl md:p-12 dark:bg-slate-800"
        >
          {/* Header */}
          <CVHeader data={cvData.personal} />

          {/* Summary */}
          <CVSection title={t.summary} icon={<FileText className="h-5 w-5" />}>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">{cvData.summary}</p>
          </CVSection>

          {/* Skills */}
          <CVSection title={t.skills} icon={<Code2 className="h-5 w-5" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <SkillBadge
                category={{
                  title: t.skillCategories.frontend,
                  skills: cvData.skills.frontend,
                  color: 'blue',
                }}
              />
              <SkillBadge
                category={{
                  title: t.skillCategories.styling,
                  skills: cvData.skills.styling,
                  color: 'purple',
                }}
              />
              <SkillBadge
                category={{
                  title: t.skillCategories.stateManagement,
                  skills: cvData.skills.stateManagement,
                  color: 'green',
                }}
              />
              <SkillBadge
                category={{
                  title: t.skillCategories.tools,
                  skills: cvData.skills.tools,
                  color: 'orange',
                }}
              />
              <SkillBadge
                category={{
                  title: t.skillCategories.testing,
                  skills: cvData.skills.testing,
                  color: 'pink',
                }}
              />
              <SkillBadge
                category={{
                  title: t.skillCategories.backend,
                  skills: cvData.skills.backend,
                  color: 'indigo',
                }}
              />
            </div>
            <SkillBadge
              category={{
                title: t.skillCategories.others,
                skills: cvData.skills.others,
                color: 'blue',
              }}
            />
          </CVSection>

          {/* Experience */}
          <CVSection title={t.experience} icon={<Briefcase className="h-5 w-5" />}>
            <div className="relative space-y-6 md:ml-3 md:border-l-2 md:border-slate-200 md:pl-8 md:dark:border-slate-700">
              {cvData.experience.map((exp, index) => (
                <ExperienceCard key={index} experience={exp} />
              ))}
            </div>
          </CVSection>

          {/* Projects */}
          <CVSection title={t.projects} icon={<Rocket className="h-5 w-5" />}>
            <div className="grid gap-4 md:grid-cols-2">
              {cvData.projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </CVSection>

          {/* Education */}
          <CVSection title={t.education} icon={<GraduationCap className="h-5 w-5" />}>
            {cvData.education.map((edu, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-5 dark:border-slate-700 dark:from-blue-900/10 dark:to-indigo-900/10"
              >
                <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                  {edu.degree}
                </h3>
                <p className="mb-2 font-semibold text-blue-600 dark:text-blue-400">{edu.school}</p>
                <div className="mb-3 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <span>{edu.location}</span>
                  <span>•</span>
                  <span>{edu.duration}</span>
                  {edu.gpa && (
                    <>
                      <span>•</span>
                      <span className="font-medium">GPA: {edu.gpa}</span>
                    </>
                  )}
                </div>
                {edu.highlights && edu.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {edu.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        <Award className="h-3 w-3" />
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CVSection>

          {/* Certifications */}
          {cvData.certifications.length > 0 && (
            <CVSection title={t.certifications} icon={<Award className="h-5 w-5" />}>
              <div className="grid gap-3 md:grid-cols-2">
                {cvData.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50"
                  >
                    <h3 className="mb-1 font-bold text-slate-900 dark:text-slate-100">
                      {cert.name}
                    </h3>
                    <p className="mb-1 text-sm text-blue-600 dark:text-blue-400">{cert.issuer}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{cert.date}</span>
                      {cert.credential && (
                        <span className="font-mono text-xs">{cert.credential}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CVSection>
          )}

          {/* Languages */}
          <CVSection title={t.languages} icon={<Languages className="h-5 w-5" />}>
            <div className="flex flex-wrap gap-3">
              {cvData.languages.map((lang, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {lang.name}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{lang.level}</span>
                </div>
              ))}
            </div>
          </CVSection>

          {/* Interests */}
          <CVSection title={t.interests} icon={<Heart className="h-5 w-5" />}>
            <div className="flex flex-wrap gap-2">
              {cvData.interests.map((interest, index) => (
                <span
                  key={index}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300"
                >
                  {interest}
                </span>
              ))}
            </div>
          </CVSection>

          {/* Footer */}
          <div className="mt-12 border-t border-slate-200 pt-6 text-center dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isVietnamese
                ? 'CV này được tạo và cập nhật vào tháng 1/2026'
                : 'This CV was generated and last updated in January 2026'}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced styles for PDF export */}
      <style jsx global>{`
        @page {
          size: A4;
          margin: 15mm 12mm;
        }

        @media print {
          /* Disable animations only */
          *,
          *::before,
          *::after {
            animation: none !important;
            transition: none !important;
          }

          /* Clean background */
          body {
            background: white !important;
          }

          /* Remove shadows and borders that don't print well */
          #cv-content {
            box-shadow: none !important;
          }

          .min-h-screen {
            background: white !important;
          }

          /* Hide print button */
          .print\\:hidden {
            display: none !important;
          }

          /* Smart page breaks - prevent breaking inside cards */
          #cv-content h2 {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          #cv-content [class*='border'][class*='rounded'] {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  )
}
