export const Partitions = {
  User: "User",
  Cart: "Cart",
  Inventory: "Inventory",
  Files: "Files",
} as const

export type DbItem<P extends string, TDetails, SK extends string = string> = {
  PK: P
  SK: SK
  details: TDetails
  TTL?: number
}

export enum InventoryItemStatus {
  pending_inspection,
  ready_for_shelf,
}
