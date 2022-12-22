import {useCallback} from 'react';
import {
  atom,
  selector,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';

type RelationshipType = 'follow' | 'unfollow';

type OptimisticRelationship = {
  counterParty: string;

  type: RelationshipType;
};

const optimisticRelationshipState = atom<OptimisticRelationship[]>({
  key: 'optimisticRelationships',
  default: [],
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

  const setOptimisticRelationship = useSetRecoilState(
    optimisticRelationshipState,
  );

  const removeOptimisticRelationship = useCallback((counterParty: string) => {
    setOptimisticRelationship(prev =>
      prev.filter(x => x.counterParty !== counterParty),
    );
  }, []);

  const handleOptimisticRelationship = useRecoilCallback(
    ({snapshot}) =>
      async ({counterParty, type}: OptimisticRelationship) => {
        const optFollowing = await snapshot.getPromise(optimisticToFollow);
        const optUnfollow = await snapshot.getPromise(optimisticToUnfollow);

        // check if there is already an optimistic follow or unfollow
        if (optFollowing.find(x => x.counterParty === counterParty)) {
          removeOptimisticRelationship(counterParty);
          setOptimisticRelationship(prev => [
            ...prev,
            {counterParty, type: 'unfollow'},
          ]);
        } else if (optUnfollow.find(x => x.counterParty === counterParty)) {
          removeOptimisticRelationship(counterParty);
          setOptimisticRelationship(prev => [
            ...prev,
            {counterParty, type: 'follow'},
          ]);
        } else {
          setOptimisticRelationship(prev => [...prev, {counterParty, type}]);
        }
      },
  );

  // console.log(
  //   'following:',
  //   optimisticFollowing,
  //   'unfollow:',
  //   optimisticUnfollow,
  //   optimisticRelationship,
  // );
  return {
    optimisticFollowing,
    optimisticUnfollow,
    removeOptimisticRelationship,
    handleOptimisticRelationship,
  };
};

export default useOptimisticRelationships;
