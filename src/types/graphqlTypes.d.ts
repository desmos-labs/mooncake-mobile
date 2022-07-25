// This is a temporary types file for types related to graphql queries.
// It will likely be replaced by some auto-generated version in the future.
export {};

declare global {
  interface ProfileParams {
    bio: {
      max_length: string;
    };
    dtag: {
      reg_ex: string;
      max_length: string;
      min_length: string;
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
      max_length: string;
      min_length: string;
    };
  }

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
