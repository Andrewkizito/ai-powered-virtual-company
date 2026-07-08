export const Partitions = {
  Users: "User",
  Cart: "Cart",
  Invetory: "Inventory",
} as const

export type DbItem<P extends string, TDetails, SK extends string = string> = {
  PK: P
  SK: SK
  details: TDetails
  TTL?: number
}
