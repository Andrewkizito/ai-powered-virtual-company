export const Partitions = {
  Users: "User",
  Cart: "Cart",
} as const;

export type DbItem<P extends string, TDetails, SK extends string = string> = {
  PK: P;
  SK: SK;
  details: TDetails;
  TTL?: number;
};

export type UserDetails = {
  sub: string;
  email: string;
  emailVerified: string;
  name: string;
  phoneNumber: string;
};

export type UserItem = DbItem<
  `${typeof Partitions.Users}#${string}`,
  UserDetails
>;

export type CartDetails = {
  items: [];
};

export type CartItem = DbItem<
  `${typeof Partitions.Users}#${string}`,
  CartDetails,
  "Cart"
>;
