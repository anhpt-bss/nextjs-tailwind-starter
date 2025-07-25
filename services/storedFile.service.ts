// services/storedFile.service.ts
import StoredFile from '@/models/storedFile.model'
import Storage from '@/models/storage.model'
import { connectDB } from '@/lib/db'
import {
  StoredFileResponse,
  UploadFilePayload,
  UploadLargeFilePayload,
  StoredFilePayload,
} from '@/types/storage'
import { uploadFileToGithub, deleteFileFromGithub } from '@/lib/github'
import mongoose, { SortOrder } from 'mongoose'
import api from '@/lib/axios'
import { decrypt } from '@/lib/encrypt'
import { toast } from 'sonner'

export const requestGetFiles = async (params: any) => {
  const res = await api.get('/api/file', { params })
  return res.data.data
}

export const requestUploadFile = async (payload: UploadFilePayload[]) => {
  const res = await api.post('/api/file/upload', payload)
  return res.data.data
}

export const requestDeleteFile = async (id: string) => {
  const res = await api.delete(`/api/file/${id}`)
  return res.data.data
}

export const requestDeleteMultipleFile = async (ids: string[]) => {
  const res = await api.post('/api/file/delete-multiple', { ids })
  return res.data.data
}

export const requestUpdateFile = async (payload: StoredFilePayload & { id: string }) => {
  const res = await api.put(`/api/file/${payload.id}`, payload)
  return res.data.data
}

export async function uploadFileToStorage(data: UploadFilePayload): Promise<StoredFileResponse> {
  await connectDB()

  const storage = await Storage.findById(data.storage)
  if (!storage) throw new Error('Storage not found')
  if (storage.platform !== 'github') throw new Error('Platform not supported')
  if (!data.base64_content) throw new Error('Missing content')

  const githubRes = await uploadFileToGithub({
    owner: storage.owner,
    repo: storage.repo,
    path: `${data.file_path}/${data.file_name}`,
    token: decrypt(storage.token),
    fileContent: data.base64_content,
    fileName: data.file_name,
  })

  return StoredFile.create({
    ...data,
    file_path: `${data.file_path}/${data.file_name}`,
    sha: githubRes.sha,
    download_url: githubRes.download_url,
    preview_url: githubRes.preview_url,
    platform: storage.platform,
    metadata: githubRes?.metadata?.content?.url,
  })
}

export async function uploadLargeFilesToStorage(files: UploadLargeFilePayload[]) {
  const storedFilePayload: StoredFilePayload[] = []
  const errors: { file: UploadLargeFilePayload; error: any }[] = []

  const toastId = toast.loading('Uploading files...')

  for (let i = 0; i < files.length; i++) {
    const fileData = files[i]
    const storage = fileData.storage

    try {
      const githubRes = await uploadFileToGithub({
        owner: storage.owner,
        repo: storage.repo,
        token: decrypt(storage.token),
        path: `${fileData.file_path}/${fileData.file_name}`,
        fileContent: fileData.base64_content,
        fileName: fileData.file_name,
      })

      storedFilePayload.push({
        storage: storage._id,
        file_name: fileData.file_name,
        file_extension: fileData.file_extension,
        content_type: fileData.content_type,
        size: fileData.size,
        file_path: `${fileData.file_path}/${fileData.file_name}`,
        sha: githubRes.sha,
        download_url: githubRes.download_url,
        preview_url: githubRes.preview_url,
        platform: storage.platform,
        metadata: githubRes?.metadata?.content?.url,
        uploaded_by: storage.user,
      })

      toast.loading(`🎉(${i + 1}/${files.length}) Uploaded files successfully`, {
        id: toastId,
        description: null,
      })
    } catch (e: any) {
      toast.loading(`🚫(${i + 1}/${files.length}) Failed to upload ${fileData.file_name}`, {
        id: toastId,
        description: e.message,
      })
      errors.push({ file: fileData, error: e.message })
    }
  }

  if (storedFilePayload.length === 0) {
    toast.error('All files failed to upload', {
      id: toastId,
      description: `${errors.map((err) => `${err.error}\n`)}`,
      duration: 6000,
    })

    throw {
      message: 'All files failed to upload',
      code: 'UPLOAD_FAILED',
      status: 400,
      errors,
    }
  }

  const res = await api.post('/api/file/save-files', storedFilePayload)

  toast.success(`Uploaded (${storedFilePayload.length} / ${files.length}) files successfully`, {
    id: toastId,
    description:
      errors.length > 0
        ? `🚫 ${errors.length} file(s) failed to upload (${errors.map((err) => `${err.error}\n`)})`
        : null,
    duration: 6000,
  })

  return { success: res.data.data, failed: errors }
}

interface GetFilesOptions {
  sort?: Record<string, SortOrder>
  skip?: number
  limit?: number
}

export async function getFilesByUser(
  userId: string,
  filters: Record<string, any> = {},
  options: GetFilesOptions = {}
) {
  await connectDB()

  const { storage, ...restFilters } = filters
  let storageFilter: mongoose.Types.ObjectId[] = []

  if (storage) {
    storageFilter = [new mongoose.Types.ObjectId(storage)]
  } else {
    const storages = await Storage.find({ user: userId }).select('_id')
    storageFilter = storages.map((s) => s._id)
  }

  const queryFilter = {
    ...restFilters,
    storage: { $in: storageFilter },
  }

  let query = StoredFile.find(queryFilter)

  if (options.sort) {
    query = query.sort(options.sort)
  }

  if (options.skip) {
    query = query.skip(options.skip)
  }

  if (options.limit) {
    query = query.limit(options.limit)
  }

  const [items, total] = await Promise.all([query.exec(), StoredFile.countDocuments(queryFilter)])

  return { items, total }
}

export async function getFileById(id: string, userId: string): Promise<StoredFileResponse | null> {
  await connectDB()
  const file = await StoredFile.findById(id).populate('storage')
  if (!file || String(file.storage.user) !== userId) return null
  return file
}

export async function updateFileMetadata(
  id: string,
  userId: string,
  metadata: Record<string, any>
): Promise<StoredFileResponse | null> {
  await connectDB()
  const file = await StoredFile.findById(id).populate('storage')
  if (!file || String(file.storage.user) !== userId) return null
  file.metadata = metadata
  await file.save()
  return file
}

export async function deleteFile(id: string, userId: string): Promise<boolean | null> {
  await connectDB()
  const file = await StoredFile.findById(id).populate('storage')
  if (!file || String(file.storage.user) !== userId) return null
  if (file.platform === 'github') {
    await deleteFileFromGithub({
      owner: file.storage.owner,
      repo: file.storage.repo,
      path: file.file_path,
      token: decrypt(file.storage.token),
      sha: file.sha,
      fileName: file.file_name,
    })
  }
  await file.deleteOne()
  return true
}

export async function getDistinctFoldersByUser(userId: string) {
  await connectDB()
  const result = await StoredFile.aggregate([
    { $match: { uploaded_by: new mongoose.Types.ObjectId(userId) } },
    {
      $project: {
        idx: { $indexOfBytes: ['$file_path', '/'] },
        file_path: 1,
      },
    },
    {
      $project: {
        folder: {
          $cond: [{ $gt: ['$idx', 0] }, { $substrBytes: ['$file_path', 0, '$idx'] }, ''],
        },
      },
    },
    { $match: { folder: { $ne: '' } } },
    { $group: { _id: '$folder' } },
    { $replaceRoot: { newRoot: { folder: '$_id' } } },
  ])
  return result.map((r: any) => r.folder)
}

export const requestGetFolders = async () => {
  const res = await api.get('/api/file/folders')
  if (!res.data.success) throw res.data
  return res.data.data as string[]
}
