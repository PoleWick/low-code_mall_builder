import request from '@/utils/request'
import type { Page, PageListItem, PageConfig, PaginatedData } from '@/types'

export interface PageListParams {
  page?: number
  pageSize?: number
  keyword?: string
}

export interface CreatePageParams {
  title?: string
  config?: PageConfig
}

export interface UpdatePageParams {
  title?: string
  config?: PageConfig
  cover?: string
  status?: 1 | 2
}

export const pagesApi = {
  getList: (params?: PageListParams) =>
    request.get<never, PaginatedData<PageListItem>>('/pages', { params }),

  getDetail: (id: number) =>
    request.get<never, Page>(`/pages/${id}`),

  create: (params: CreatePageParams) =>
    request.post<never, Page>('/pages', params),

  update: (id: number, params: UpdatePageParams) =>
    request.put<never, Page>(`/pages/${id}`, params),

  remove: (id: number) =>
    request.delete<never, null>(`/pages/${id}`),

  duplicate: (id: number) =>
    request.post<never, Page>(`/pages/${id}/duplicate`),

  export: (id: number) =>
    request.get<never, PageConfig>(`/pages/${id}/export`),
}
 