export interface VersionPatch {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test'
  path: string
  value?: unknown
  from?: string
}

export interface Version {
  id: string
  adminId?: string
  number: number
  label: string
  patch: VersionPatch[]
  createdAt: string
  publishedSnapshot?: string
}
