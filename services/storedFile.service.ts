// services/storedFile.service.ts

import mongoose, { SortOrder } from 'mongoose'

import { connectDB } from '@/lib/db'
import { decrypt } from '@/lib/encrypt'
import { uploadFileToGithub, deleteFileFromGithub } from '@/lib/github'
import Storage from '@/models/storage.model'
import StoredFile from '@/models/storedFile.model'
import { StoredFileResponse, UploadFilePayload } from '@/types/storage'

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
