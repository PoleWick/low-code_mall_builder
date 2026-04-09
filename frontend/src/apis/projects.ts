import request from '@/utils/request'
import type { Project, NavBarConfig } from '@/types'

export interface CreateProjectParams {
  name:         string
  description?: string
}

export interface UpdateProjectParams {
  name?:         string
  description?:  string
  navbarConfig?: NavBarConfig
}

export const projectsApi = {
  getList: () =>
    request.get<never, Project[]>('/projects'),

  getDetail: (id: number) =>
    request.get<never, Project>(`/projects/${id}`),

  create: (params: CreateProjectParams) =>
    request.post<never, Project>('/projects', params),

  update: (id: number, params: UpdateProjectParams) =>
    request.put<never, Project>(`/projects/${id}`, params),

  remove: (id: number) =>
    request.delete<never, null>(`/projects/${id}`),

  createPage: (projectId: number, params: { title?: string }) =>
    request.post<never, import('@/types').Page>(`/projects/${projectId}/pages`, params),
}
