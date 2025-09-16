// requests/useResource.ts

import { toast } from 'sonner'

import siteMetadata from '@/data/siteMetadata'
import api from '@/lib/axios'
import { decrypt } from '@/lib/encrypt'
import { uploadFileToGithub, checkFileExistsOnGithub } from '@/lib/github'
import { ResourceCreate, ResourceResponse, UploadCloudResourcePayload } from '@/types/resource'
import { StorageResponse } from '@/types/storage'
import { fileToBase64 } from '@/utils/helper'

// Requests
export async function uploadFilesToGithub(files: UploadCloudResourcePayload[]) {
  const createResourcePayload: ResourceCreate[] = []
  const errors: { file: UploadCloudResourcePayload; error: any }[] = []

  const toastId = toast.loading('Uploading files...')

  for (let i = 0; i < files.length; i++) {
    const fileData = files[i]
    const { storage, base64_content, saved_path, ...rest } = fileData

    try {
      const githubRes = await uploadFileToGithub({
        owner: storage.owner,
        repo: storage.repo,
        token: decrypt(storage.token),
        path: `${saved_path}/${rest.filename}`,
        fileContent: base64_content,
        fileName: rest.filename,
      })

      createResourcePayload.push({
        ...rest,
        storage: storage._id,
        path: `${saved_path}/${rest.filename}`,
        sha: githubRes.sha,
        download_url: githubRes.download_url,
        preview_url: githubRes.preview_url,
        metadata: githubRes?.metadata?.content?.url,
      })

      toast.loading(`🎉(${i + 1}/${files.length}) Uploaded files successfully`, {
        id: toastId,
        description: null,
      })
    } catch (error) {
      console.log(error)

      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error'
      toast.loading(`🚫(${i + 1}/${files.length}) Failed to upload ${rest.filename}`, {
        id: toastId,
        description: errorMessage,
      })
      errors.push({ file: fileData, error: errorMessage })
    }
  }

  if (createResourcePayload.length === 0) {
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

  try {
    const res = await api.post('/api/resources/save-files', createResourcePayload)
    toast.success(
      `Uploaded (${createResourcePayload.length} / ${files.length}) files successfully`,
      {
        id: toastId,
        description:
          errors.length > 0
            ? `🚫 ${errors.length} file(s) failed to upload (${errors.map((err) => `${err.error}\n`)})`
            : null,
        duration: 6000,
      }
    )

    return { success: res.data.data, failed: errors }
  } catch (error) {
    console.log(error)

    const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error'
    toast.error('Failed to save files to database', {
      id: toastId,
      description: errorMessage,
      duration: 6000,
    })
    throw {
      message: 'All files failed to upload',
      code: 'SAVED_FAILED',
      status: 400,
      errors,
    }
  }
}

export const uploadFilesAndSaveResource = async (files: File[], cloudStorage: StorageResponse) => {
  const provider = siteMetadata.upload.provider

  switch (provider) {
    case 'github': {
      const payloads: UploadCloudResourcePayload[] = []
      for (const file of files) {
        const base64_content = await fileToBase64(file)
        payloads.push({
          platform: siteMetadata.upload.provider,
          storage: cloudStorage,
          base64_content,
          saved_path: 'uploads',
          filename: file.name,
          mimetype: file.type,
          size: file.size,
        })
      }

      return await uploadFilesToGithub(payloads)
    }
    case 'local':
    default:
      console.error(`Upload provider ${provider} not supported yet.`)
      return null
  }
}

// Single upload
export async function uploadFileToGithubAndSave(fileData: UploadCloudResourcePayload) {
  const toastId = toast.loading(`Uploading ${fileData.filename}...`)

  const { storage, base64_content, saved_path, ...rest } = fileData

  try {
    const existedFile = await checkFileExistsOnGithub({
      owner: storage.owner,
      repo: storage.repo,
      token: decrypt(storage.token),
      path: `${saved_path}/${rest.filename}`,
    })

    if (existedFile) {
      const res = await api.get(
        `/api/resources?sha=${existedFile.sha}&path=${encodeURIComponent(`${saved_path}/${rest.filename}`)}`
      )

      toast.success(`Uploaded ${rest.filename} successfully`, {
        id: toastId,
        duration: 4000,
      })

      return res?.data?.data?.items?.[0] as ResourceResponse
    } else {
      const githubRes = await uploadFileToGithub({
        owner: storage.owner,
        repo: storage.repo,
        token: decrypt(storage.token),
        path: `${saved_path}/${rest.filename}`,
        fileContent: base64_content,
        fileName: rest.filename,
      })

      const resourcePayload: ResourceCreate = {
        ...rest,
        storage: storage._id,
        path: `${saved_path}/${rest.filename}`,
        sha: githubRes.sha,
        download_url: githubRes.download_url,
        preview_url: githubRes.preview_url,
        metadata: githubRes?.metadata?.content?.url,
      }

      const res = await api.post('/api/resources/save-file', resourcePayload)

      toast.success(`Uploaded ${rest.filename} successfully`, {
        id: toastId,
        duration: 4000,
      })

      return res?.data?.data as ResourceResponse
    }
  } catch (error) {
    console.error(error)
    const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error'

    toast.error(`Failed to upload ${fileData.filename}`, {
      id: toastId,
      description: errorMessage,
      duration: 6000,
    })

    throw {
      message: `Failed to upload ${fileData.filename}`,
      code: 'UPLOAD_FAILED',
      status: 400,
      error: errorMessage,
    }
  }
}

export const uploadFileAndSaveResource = async (file: File, cloudStorage: StorageResponse) => {
  const provider = siteMetadata.upload.provider

  switch (provider) {
    case 'github': {
      const base64_content = await fileToBase64(file)

      const payload: UploadCloudResourcePayload = {
        platform: siteMetadata.upload.provider,
        storage: cloudStorage,
        base64_content,
        saved_path: 'uploads',
        filename: file.name,
        mimetype: file.type,
        size: file.size,
      }

      return await uploadFileToGithubAndSave(payload)
    }
    case 'local':
    default:
      throw new Error(`Upload provider ${provider} not supported yet.`)
  }
}
