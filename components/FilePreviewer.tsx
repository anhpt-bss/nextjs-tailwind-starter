'use client'

import Lightbox, { Slide } from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Video from 'yet-another-react-lightbox/plugins/video'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Download from 'yet-another-react-lightbox/plugins/download'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Share from 'yet-another-react-lightbox/plugins/share'
import 'yet-another-react-lightbox/plugins/counter.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import { formatSize, getFilePreviewIconOrImage } from '@/utils/helper'
import dayjs from 'dayjs'
import { DocumentIcon } from '@heroicons/react/24/outline'
import { StoredFileResponse } from '@/types/storage'

const breakpoints = [3840, 1920, 1080, 640, 384, 256, 128]

type ExtendedSlide = StoredFileResponse & Slide

interface FilePreviewerProps {
  open: boolean
  setOpen: (open: boolean) => void
  files: StoredFileResponse[]
  currentFile: StoredFileResponse
}

export default function FilePreviewer({ open, setOpen, files, currentFile }: FilePreviewerProps) {
  const currentIndex = files.findIndex((f) => f.download_url === currentFile.download_url)

  const slides: ExtendedSlide[] = files.map((file, index) => {
    const isImage = file.content_type.startsWith('image/')
    const isVideo = file.content_type.startsWith('video/')
    const srcLink = file.preview_url || file.download_url

    if (isImage) {
      const defaultWidth = 3840
      const defaultHeight = 2160

      const width = file.metadata?.width ?? defaultWidth
      const height = file.metadata?.height ?? defaultHeight

      return {
        ...file,
        type: 'image' as const,
        src: srcLink,
        width,
        height,
        srcSet: breakpoints.map((bp) => ({
          src: srcLink,
          width: bp,
          height: Math.round((height / width) * bp),
        })),
        title: file.file_name,
        description: (
          <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-300">
            <span>{formatSize(file?.size || 0)}</span>-<span>{file.content_type}</span>-
            <span>{dayjs(file.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>
          </div>
        ),
        download: {
          url: file.download_url,
          filename: file.file_name,
        },
        share: { url: srcLink, title: file.file_name },
      }
    }

    if (isVideo) {
      return {
        ...file,
        type: 'video' as const,
        title: file.file_name,
        description: (
          <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-300">
            <span>{formatSize(file?.size || 0)}</span>-<span>{file.content_type}</span>-
            <span>{dayjs(file.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>
          </div>
        ),
        width: 1280,
        height: 720,
        poster: srcLink,
        sources: [
          {
            src: srcLink,
            type: file.content_type,
          },
        ],
        download: {
          url: file.download_url,
          filename: file.file_name,
        },
        share: { url: srcLink, title: file.file_name },
      }
    }

    return {
      ...file,
      src: srcLink,
      title: file.file_name,
    }
  })

  return (
    <Lightbox
      open={open}
      close={() => setOpen(false)}
      index={currentIndex}
      slides={slides}
      plugins={[Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom, Download, Counter, Share]}
      captions={{
        hidden: true,
        showToggle: true,
        descriptionTextAlign: 'start',
        descriptionMaxLines: 3,
      }}
      counter={{ container: { style: { top: 'unset', bottom: 20, right: 0, left: 'unset' } } }}
      slideshow={{ autoplay: false, delay: 3000 }}
      zoom={{
        minZoom: 1, // không đổi - mức zoom nhỏ nhất là 1x (đúng gốc)
        maxZoomPixelRatio: 10, // mặc định là 1 – tăng lên để zoom sâu hơn (zoom 10x pixel)
        zoomInMultiplier: 10, // mỗi lần zoom sẽ nhảy mạnh hơn (tăng nhanh)
        doubleTapDelay: 1000, // delay tối đa trước khi coi là double tap
        doubleClickDelay: 1000, // delay tối đa trước khi coi là double click
        doubleClickMaxStops: 10, // số bước zoom tối đa khi double click
        keyboardMoveDistance: 500, // khi bấm phím mũi tên sẽ di chuyển xa hơn
        wheelZoomDistanceFactor: 1, // càng nhỏ thì zoom càng mạnh khi cuộn chuột
        pinchZoomDistanceFactor: 10, // càng nhỏ thì zoom càng mạnh khi pinch
        scrollToZoom: true, // bật zoom bằng cuộn chuột
      }}
      render={{
        slide: ({ slide, rect }) => {
          const fileInfo = slide as ExtendedSlide
          const fileType = fileInfo.content_type || fileInfo.type
          const fileSrc = fileInfo.preview_url || fileInfo.download_url
          const fileName = fileInfo.file_name || 'File Preview'

          if (slide.type === 'image' || slide.type === 'video') {
            return undefined
          } else if (fileType === 'audio') {
            return (
              <audio controls style={{ width: rect.width }} src={fileSrc} title={fileName}>
                <track kind="captions" />
              </audio>
            )
          }
          return (
            <div className="flex h-full w-full flex-col items-center justify-center">
              {getFilePreviewIconOrImage(fileInfo, 128, false)}
              <div className="text-lg font-medium text-gray-800 dark:text-white">{fileName}</div>
              <div className="text-xs text-gray-500 dark:text-gray-300">{fileType}</div>
              <button
                className="mt-4 cursor-pointer rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                onClick={() => window.open(fileSrc, '_blank')}
              >
                Download
              </button>
            </div>
          )
        },
      }}
    />
  )
}
