// This is a temporary types file for types related to graphql queries.
// It will likely be replaced by some auto-generated version in the future.
export {};

// min_length and max_length are returned as strings, but we can use
// the power of javascript to automatically cast them into numbers
declare global {
  interface ProfileParams {
    bio: {
      max_length: any;
    };
    dtag: {
      reg_ex: string;
      max_length: any;
      min_length: any;
    };
    oracle: {
      ask_count: number;
      min_count: number;
      script_id: number;
      fee_amount: [];
      execute_gas: number;
      prepare_gas: number;
    };
    nickname: {
      max_length: any;
      min_length: any;
    };
  }

  interface CounterParty {
    dtag: string;
    nickname: string;
    address: string;
  }

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
  }

  interface ConnectedAppsQueryData {
    application_link: ConnectedApps[];
  }
}
