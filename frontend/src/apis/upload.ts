import request from '@/utils/request'

export interface UploadResult {
  url: string
}

export const uploadApi = {
  image: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return request.post<never, UploadResult>('/upload/image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
