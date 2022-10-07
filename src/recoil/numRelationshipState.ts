import {
  selectorFamily,
  useRecoilRefresher_UNSTABLE,
  useRecoilValueLoadable,
} from 'recoil';
import client from 'services/graphql/client';
import GetNumRelationshipsForAddress from 'services/graphql/queries/GetNumRelationshipsForAddress';
import _ from 'lodash';

type NumRelationshipType = {
  numFollowing: number;
  numFollowers: number;
};

const numRelationshipState = selectorFamily<
  NumRelationshipType | undefined,
  string
>({
  key: 'numRelationshipState',
  get: (address: string) => async () => {
    const {data} = await client.query({
      query: GetNumRelationshipsForAddress,
      variables: {
        address,
      },
      fetchPolicy: 'no-cache',
    });

    if (data) {
      const numFollowers = _.get(
        data,
        'profile[0].followage_aggregate.aggregate.count',
      );
      const numFollowing = _.get(
        data,
        'profile[0].following_aggregate.aggregate.count',
      );

      return {
        numFollowers,
        numFollowing,
      };
    }
    return undefined;
  },
});

const useNumRelationships = (
  address: string,
): {
  loading: boolean;
  numRelationships: NumRelationshipType | undefined;
  error: string;
  refreshNumRelationships: () => void;
} => {
  const numRelationshipsSelector = useRecoilValueLoadable<
    NumRelationshipType | undefined
  >(numRelationshipState(address));

  const refreshNumRelationships = useRecoilRefresher_UNSTABLE(
    numRelationshipState(address),
  );

  return {
    loading: numRelationshipsSelector.state === 'loading',
    numRelationships:
      numRelationshipsSelector.state === 'hasValue'
        ? numRelationshipsSelector.contents
        : undefined,
    error:
      numRelationshipsSelector.state === 'hasError' &&
      numRelationshipsSelector.contents,
    refreshNumRelationships,
  };
};

export default useNumRelationships;
