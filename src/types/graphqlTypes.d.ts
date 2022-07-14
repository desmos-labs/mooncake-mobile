// This is a temporary types file for types related to graphql queries.
// It will likely be replaced by some auto-generated version in the future.
export {};

declare global {
  interface CounterParty {
    dtag: string;
    nickname: string;
    address: string;
  }

  interface ProfileData {
    address: string;
    bio: string;
    cover_pic: string;
    dtag: string;
    profile_pic: string;
    nickname: string;
    followage_aggregate: {
      aggregate: {
        count: number;
      };
    };
    following_aggregate: {
      aggregate: {
        count: number;
      };
    };
  }
}
