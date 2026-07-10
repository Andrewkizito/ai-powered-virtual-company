import type { DbItem } from "./core"
import { Partitions } from "./core"

export type FileDetails = {
  id: string
  name: string
  type: string
  createdAt: string
  updatedAt: string | null
  size: number
  path: string
  etag: string
}

export type FileItem = DbItem<
  typeof Partitions.Files,
  FileDetails,
  `File#${string}`
>

export type FilesLedgerDetails = {
  totalFiles: number
  totalSize: number
  updatedAt: string
}

export type FilesLedgerItem = DbItem<
  typeof Partitions.Files,
  FilesLedgerDetails,
  "Details"
>
