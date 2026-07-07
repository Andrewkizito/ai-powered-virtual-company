export const Partitions = {
  Users: "User",
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
