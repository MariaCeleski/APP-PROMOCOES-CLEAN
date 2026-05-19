import api from './api'

interface UploadResponse {
  url: string
  path: string
}

// ─── uploadImage ─────────────────────────────────────────────────────────────

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('image', file)

  const { data } = await api.post<UploadResponse>('/api/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return data.url
}

// ─── deleteImage ─────────────────────────────────────────────────────────────

export async function deleteImage(path: string): Promise<void> {
  await api.delete('/api/upload/image', { data: { path } })
}
