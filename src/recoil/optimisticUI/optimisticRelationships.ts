import {
  atom,
  selector,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
  useResetRecoilState,
} from 'recoil';
import {followedAddressesState} from '@recoil/following';
import {deleteMMKV, getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import {useCallback} from 'react';

type RelationshipType = 'follow' | 'unfollow';

type OptimisticRelationship = {
  counterParty: string;

  type: RelationshipType;
};

const optimisticRelationshipState = atom<OptimisticRelationship[]>({
  key: 'optimisticRelationships',
  default: getMMKV(MMKVKEYS.OPTIMISTIC_RELATIONSHIPS) || [],
  effects: [
    ({onSet}) => {
      onSet(newValue => {
        setMMKV(MMKVKEYS.OPTIMISTIC_RELATIONSHIPS, newValue);
      });
    },
  ],
});

export const optimisticToFollow = selector<OptimisticRelationship[]>({
  key: 'optimisticToFollow',
  get: ({get}) => {
    const optRelationships = get(optimisticRelationshipState);
    return optRelationships.filter(x => x.type === 'follow');
  },
});

export const optimisticToUnfollow = selector<OptimisticRelationship[]>({
  key: 'optimisticToUnfollow',
  get: ({get}) => {
    const optRelationships = get(optimisticRelationshipState);
    return optRelationships.filter(x => x.type === 'unfollow');
  },
});

export const hasOptimisticFollow = selectorFamily<boolean, string>({
  key: 'hasOptimisticFollow',
  get:
    (address: string) =>
    ({get}) => {
      const optFollow = get(optimisticToFollow);
      return !!optFollow.find(x => x.counterParty === address);
    },
});

export const hasOptimisticUnfollow = selectorFamily<boolean, string>({
  key: 'hasOptimisticFollow',
  get:
    (address: string) =>
    ({get}) => {
      const optFollow = get(optimisticToUnfollow);
      return !!optFollow.find(x => x.counterParty === address);
    },
});

const useOptimisticRelationships = () => {
  const optimisticFollowing = useRecoilValue(optimisticToFollow);
  const optimisticUnfollow = useRecoilValue(optimisticToUnfollow);
  const resetOptimisticRelationShipsState = useResetRecoilState(
    optimisticRelationshipState,
  );

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
          set(optimisticRelationshipState, prev => [
            ...prev,
            {counterParty, type: 'unfollow' as RelationshipType},
          ]);
        } else if (optUnfollow.find(x => x.counterParty === counterParty)) {
          set(optimisticRelationshipState, prev =>
            prev.filter(x => x.counterParty !== counterParty),
          );

          set(optimisticRelationshipState, prev => [
            ...prev,
            {counterParty, type: 'follow' as RelationshipType},
          ]);
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

  const resetOptimisticRelationships = useCallback(() => {
    resetOptimisticRelationShipsState();
    deleteMMKV(MMKVKEYS.OPTIMISTIC_RELATIONSHIPS);
  }, []);

  return {
    optimisticFollowing,
    optimisticUnfollow,
    handleOptimisticRelationship,
    resolveOptimisticRelationships,
    resetOptimisticRelationships,
  };
};

export default useOptimisticRelationships;
