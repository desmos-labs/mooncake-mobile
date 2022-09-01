import {atomFamily} from 'recoil';

export type NumOfFollowerParam = {
  type: 'following' | 'followers';
  subspaceID: number;
  userAddress: string;
};

const numOfFollowerState = atomFamily<number, NumOfFollowerParam>({
  key: 'numOfFollowerState',
  default: 0,
});

export default numOfFollowerState;
