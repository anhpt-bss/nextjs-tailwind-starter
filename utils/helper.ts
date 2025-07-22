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
