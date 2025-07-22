// lib/hash.ts
import bcrypt from 'bcryptjs'

export async function hashCharacter(character: string) {
  return bcrypt.hash(character, 10)
}

export async function compareCharacter(character: string, hash: string) {
  return bcrypt.compare(character, hash)
}
