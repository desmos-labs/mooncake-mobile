import React from 'react';
import {gql, useQuery} from '@apollo/client';

export type GetFollowStatsForAddressData = {
  profile: {
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
  }[];
};

const GetNumRelationshipsForAddress = gql`
  query GetFollowStatsForAddress($address: String) @api(name: butter) {
    profile(where: {address: {_eq: $address}}) {
      followage_aggregate(where: {creator: {}}) {
        aggregate {
          count
        }
      }
      following_aggregate(where: {counterparty: {}}) {
        aggregate {
          count
        }
      }
    }
  }
`;

export const useFollowStatsForAddress = (address: string) => {
  const {data} = useQuery<GetFollowStatsForAddressData>(
    GetNumRelationshipsForAddress,
    {variables: {address}},
  );

  const profileData = React.useMemo(() => {
    if (!data) return undefined;
    const {profile} = data;

    const [firstProfile] = profile;

    return firstProfile;
  }, [data]);

  const numFollowers = React.useMemo(() => {
    if (!profileData) return 0;

    return profileData?.followage_aggregate?.aggregate?.count || 0;
  }, [profileData]);

  const numFollowing = React.useMemo(() => {
    if (!profileData) return 0;

    return profileData?.following_aggregate?.aggregate?.count || 0;
  }, [profileData]);

  return {
    numFollowers,
    numFollowing,
  };
};

export default GetNumRelationshipsForAddress;
