import React from 'react';
import { gql, useQuery } from '@apollo/client';

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
  query GetFollowStatsForAddress($subspaceID: bigint!, $address: String!) @api(name: butter) {
    followage_aggregate: user_relationship_aggregate(
      where: { subspace_id: { _eq: $subspaceID }, counterparty_address: { _eq: $address } }
    ) {
      aggregate {
        count
      }
    }
    following_aggregate: user_relationship_aggregate(
      where: { subspace_id: { _eq: $subspaceID }, creator_address: { _eq: $address } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const useFollowStatsForAddress = (address: string) => {
  const { data } = useQuery<GetFollowStatsForAddressData>(GetNumRelationshipsForAddress, {
    variables: { address },
  });

  const profileData = React.useMemo(() => {
    if (!data) return undefined;
    const { profile } = data;

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
