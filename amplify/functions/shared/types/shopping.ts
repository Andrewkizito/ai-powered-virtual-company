import type { DbItem } from "./core"
import { Partitions } from "./core"

export type CartDetails = {
  items: []
}

export type CartItem = DbItem<
  `${typeof Partitions.Users}#${string}`,
  CartDetails,
  "Cart"
>
