import {atom, selector, selectorFamily} from 'recoil';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import activeAddressState from '@recoil/activeAddressState';

export type RelationshipType = 'follow' | 'unfollow';

export type OptimisticRelationship = {
  counterParty: string;

  type: RelationshipType;
};

export const optimisticRelationshipState = atom<OptimisticRelationship[]>({
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

export const optimisticRelationshipModifier = selectorFamily<number, string>({
  key: 'optimisticRelationshipModifier',
  get:
    (address: string) =>
    ({get}) => {
      const optFollow = get(optimisticToFollow);
      const optUnFollow = get(optimisticToUnfollow);

      const activeAddress = get(activeAddressState);

      if (activeAddress === address) {
        return optFollow.length - optUnFollow.length;
      }

      const numOptFollowForAddress = optFollow.filter(
        x => x.counterParty === address,
      ).length;

      const numOptUnFollowForAddress = optUnFollow.filter(
        x => x.counterParty === address,
      ).length;

      return numOptFollowForAddress - numOptUnFollowForAddress;
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
