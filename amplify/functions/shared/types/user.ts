import type { DbItem } from "./core"
import { Partitions } from "./core"

export type UserDetails = {
  sub: string
  email: string
  emailVerified: string
  name: string
  phoneNumber: string
}

export type UserItem = DbItem<
  `${typeof Partitions.Users}#${string}`,
  UserDetails
>
