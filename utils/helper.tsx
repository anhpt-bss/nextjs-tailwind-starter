import {
  DocumentIcon,
  PhotoIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline'
import React from 'react'
import _ from 'lodash'
import type { StoredFileResponse } from '@/types/storage'
import Image from 'next/image'

export const getFilePreviewIconOrImage = (
  file: File | StoredFileResponse,
  size = 32,
  showImg = true
) => {
  const style = { width: size, height: size }
  let type = ''
  let name = ''
  let imageUrl: string | undefined

  if (file instanceof File) {
    type = file.type
    name = file.name
    imageUrl = URL.createObjectURL(file)
  } else {
    type = file.content_type || ''
    name = file.file_name || ''
    imageUrl = file.preview_url || file.download_url
  }

  if (type.startsWith('image')) {
    if (imageUrl && showImg) {
      return (
        <Image
          src={imageUrl}
          alt={name}
          width={style.width}
          height={style.height}
          className="rounded object-cover"
        />
      )
    }
    return <PhotoIcon style={style} className="text-blue-400" />
  }
  if (type.startsWith('video')) return <VideoCameraIcon style={style} className="text-purple-400" />
  if (type.startsWith('audio')) return <SpeakerWaveIcon style={style} className="text-pink-400" />
  if (type.startsWith('text')) return <CodeBracketIcon style={style} className="text-blue-400" />
  if (type.includes('zip') || type.includes('rar') || type.includes('tar'))
    return <ArchiveBoxIcon style={style} className="text-yellow-500" />
  if (type.startsWith('audio') || type.startsWith('music'))
    return <MusicalNoteIcon style={style} className="text-pink-400" />
  return <DocumentIcon style={style} className="text-gray-400" />
}

export const formatSize = (size: number) => {
  if (size > 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + ' MB'
  if (size > 1024) return (size / 1024).toFixed(2) + ' KB'
  return size + ' B'
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
  })
}

export const handleDownload = async (fileName: string, downloadUrl: string) => {
  try {
    const response = await fetch(downloadUrl, { mode: 'cors' })
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  } catch (error) {
    console.error(error)
  }
}

export const getAvatarUrl = (avatar: string | undefined) => {
  if (_.isEmpty(avatar) || !avatar?.includes('http')) {
    return '/static/images/default-avatar.jpg'
  }
  return avatar
}
