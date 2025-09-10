import { randomUUID } from 'crypto'
import fs from 'fs/promises'
import path from 'path'

import ResourceModel from '@/models/resource.model'
import type { ResourceResponse } from '@/types/resource'
import { errorResponse } from '@/utils/response'

export async function uploadResourceFile(file: any): Promise<ResourceResponse> {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })

    const originalName = file.originalFilename || file.name || 'file'
    const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_')

    let buffer: Buffer
    if (file.filepath) {
      buffer = await fs.readFile(file.filepath)
    } else if (file.arrayBuffer) {
      buffer = Buffer.from(await file.arrayBuffer())
    } else {
      throw new Error('Cannot determine file buffer')
    }

    const existed = await ResourceModel.findOne({
      filename: originalName,
      size: file.size,
      mimetype: file.type,
    })

    if (existed) {
      return existed
    }

    const filename = `${Date.now()}_${randomUUID()}_${safeName}`
    const filePath = path.join(uploadDir, filename)

    const [_, resource] = await Promise.all([
      fs.writeFile(filePath, buffer),
      ResourceModel.create({
        filename: originalName,
        path: `/uploads/${filename}`,
        size: file.size,
        mimetype: file.type,
      }),
    ])

    return resource
  } catch (error: any) {
    console.error('Upload error:', error)
    const status = error?.status || 500
    throw new Error(status === 500 ? 'System error during file upload' : error.message)
  }
}

export function validateFiles(files: File[]) {
  const maxFiles = Number(process.env.UPLOAD_MAX_FILES) || 10
  const maxSizeMB = Number(process.env.UPLOAD_MAX_SIZE_MB) || 20
  const maxSize = maxSizeMB * 1024 * 1024
  const allowedMime = (process.env.UPLOAD_ALLOWED_MIME || '')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean)

  if (files.length === 0) {
    return {
      valid: false,
      error: errorResponse('No files uploaded', 'NO_FILES', 400),
    }
  }

  if (files.length > maxFiles) {
    return {
      valid: false,
      error: errorResponse(
        `Exceeded the allowed number of files (${maxFiles})`,
        'UPLOAD_LIMIT_EXCEEDED',
        400
      ),
    }
  }

  for (const file of files) {
    if (file.size > maxSize) {
      return {
        valid: false,
        error: errorResponse(
          `File ${file.name} exceeds the maximum size (${maxSizeMB}MB)`,
          'UPLOAD_SIZE_EXCEEDED',
          400
        ),
      }
    }

    if (allowedMime.length > 0 && !allowedMime.includes(file.type)) {
      return {
        valid: false,
        error: errorResponse(
          `File type ${file.type} is not allowed`,
          'UPLOAD_TYPE_NOT_ALLOWED',
          415
        ),
      }
    }
  }

  return { valid: true }
}
