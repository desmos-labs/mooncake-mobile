// This is a temporary types file for types related to graphql queries.
// It will likely be replaced by some auto-generated version in the future.

export {};

// min_length and max_length are returned as strings, but we can use
// the power of javascript to automatically cast them into numbers
// TODO: This should be deleted in favor of in-app specific types and converters
declare global {
  interface ProfileSummary {
    dtag: string;
    nickname: string;
    profile_pic: string;
    address: string;
  }

  interface PaginatedFollower {
    _: ProfileSummary;
  }

  interface FollowerType {
    counterparty_address: string;
    subspace_id: number;
  }

  interface ProfileData {
    address: string;
    bio: string;
    cover_pic: string;
    dtag: string;
    profile_pic: string;
    nickname: string;
    followage: FollowerType[];
    following: FollowerType[];
    creation_time: string;
    transactions: {
      hash: string;
    }[];
  }

  interface ConnectedApps {
    application: string;
    creation_time: string;
    username: string;
    state: string;
    result: any;
  }

  interface ConnectedAppsQueryData {
    application_link: ConnectedApps[];
  }
}
