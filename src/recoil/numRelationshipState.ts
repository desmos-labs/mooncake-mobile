import EnvConfig from 'config/EnvConfig';
import {
  selectorFamily,
  useRecoilRefresher_UNSTABLE,
  useRecoilValueLoadable,
} from 'recoil';
import client from 'services/graphql/client';
import GetNumRelationshipsForAddress from 'services/graphql/queries/GetNumRelationshipsForAddress';
import _ from 'lodash';
import {optimisticRelationshipModifier} from '@recoil/optimisticUI/optimisticRelationships';
import activeAddressState from '@recoil/activeAddressState';

type NumRelationshipType = {
  numFollowing: number;
  numFollowers: number;
};

/**
 * A selector family that represents the number of followage and following a user has.
 */
const numRelationshipState = selectorFamily<
  NumRelationshipType | undefined,
  string
>({
  key: 'numRelationshipState',
  get:
    (address: string) =>
    async ({get}) => {
      const {data} = await client.query({
        query: GetNumRelationshipsForAddress,
        variables: {
          subspaceID: EnvConfig.APP_SUBSPACE_ID,
          address,
        },
        fetchPolicy: 'no-cache',
      });

      const activeAddress = get(activeAddressState);
      const optRelationshipMod = get(optimisticRelationshipModifier(address));

      if (data) {
        const numFollowers = _.get(data, 'followage_aggregate.aggregate.count');
        const numFollowing = _.get(data, 'following_aggregate.aggregate.count');

        // Locally modify the active user's number of FOLLOWING (i.e the number of users they are currently following)
        if (activeAddress === address) {
          return {
            numFollowers,
            numFollowing: numFollowing + optRelationshipMod,
          };
        }

        // Locally modify the guest profile's number of FOLLOWERS
        return {
          numFollowers: numFollowers + optRelationshipMod,
          numFollowing,
        };
      }
      return undefined;
    },
});

/**
 * A hook to make the selectorFamily above more reusable, extending it with an
 * error and loading variable.
 */
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
