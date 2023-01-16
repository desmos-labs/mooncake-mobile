import {useRecoilCallback, useRecoilValue} from 'recoil';
import {followedAddressesState} from '@recoil/following';
import {
  OptimisticRelationship,
  optimisticRelationshipState,
  optimisticToFollow,
  optimisticToUnfollow,
} from '@recoil/optimisticUI/optimisticRelationships';

const useOptimisticRelationships = () => {
  const optimisticFollowing = useRecoilValue(optimisticToFollow);
  const optimisticUnfollow = useRecoilValue(optimisticToUnfollow);

  const handleOptimisticRelationship = useRecoilCallback(
    ({snapshot, set}) =>
      async ({counterParty, type}: OptimisticRelationship) => {
        const optFollowing = await snapshot.getPromise(optimisticToFollow);
        const optUnfollow = await snapshot.getPromise(optimisticToUnfollow);

        // check if there is already an optimistic follow or unfollow
        if (optFollowing.find(x => x.counterParty === counterParty)) {
          set(optimisticRelationshipState, prev =>
            prev.filter(x => x.counterParty !== counterParty),
          );
          set(optimisticRelationshipState, prev => [...prev]);
        } else if (optUnfollow.find(x => x.counterParty === counterParty)) {
          set(optimisticRelationshipState, prev =>
            prev.filter(x => x.counterParty !== counterParty),
          );

          set(optimisticRelationshipState, prev => [...prev]);
        } else {
          set(optimisticRelationshipState, prev => [
            ...prev,
            {counterParty, type},
          ]);
        }
      },
  );

  const resolveOptimisticRelationships = useRecoilCallback(
    ({snapshot, set}) =>
      async () => {
        const optRelationships = await snapshot.getPromise(
          optimisticRelationshipState,
        );
        const followingSet = await snapshot.getPromise(followedAddressesState);

        const resolvedOptRelationships = optRelationships.filter(x => {
          if (x.type === 'follow') {
            return !followingSet.has(x.counterParty);
          } else {
            return followingSet.has(x.counterParty);
          }
        });
        set(optimisticRelationshipState, resolvedOptRelationships);
      },
  );

  const resolveOptimisticRelationshipForAddress = useRecoilCallback(
    ({snapshot, set}) =>
      async (address: string) => {
        console.log('resolving optimistic relationship for address');
        const optRelationships = await snapshot.getPromise(
          optimisticRelationshipState,
        );

        const filteredOptRelationships = optRelationships.filter(
          x => x.counterParty !== address,
        );

        set(optimisticRelationshipState, filteredOptRelationships);
      },
  );

  return {
    optimisticFollowing,
    optimisticUnfollow,
    handleOptimisticRelationship,
    resolveOptimisticRelationships,
    resolveOptimisticRelationshipForAddress,
  };
};

export default useOptimisticRelationships;
