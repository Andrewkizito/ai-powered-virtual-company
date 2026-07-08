import type { DbItem, InventoryItemStatus } from "./core"
import { Partitions } from "./core"

// Cart
export type CartDetails = {
  items: []
}

export type CartItem = DbItem<
  `${typeof Partitions.User}#${string}`,
  CartDetails,
  "Cart"
>

// Inventory
export type InventoryItemDetails = {
  id: string
  name: string
  description: string
  spec: string
  stock: number
  updatedAt: string
  createdAt: string
  status: InventoryItemStatus
  rules: {
    restockThreshold: number
    pricingMode: "fixed" | "dynamic"
  } | null
}

export type InventoryItem = DbItem<
  `${typeof Partitions.Inventory}#${string}`,
  InventoryItemDetails,
  "Inventory"
>
