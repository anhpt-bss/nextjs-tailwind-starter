import { cvDataEN } from './en'
import { cvDataVI } from './vi'

export { cvDataEN, cvDataVI }

export const getCVData = (locale: string) => {
  return locale === 'vi' ? cvDataVI : cvDataEN
}
