import {atomFamily} from 'recoil';

const numOfFollowerState = atomFamily<number, 'following' | 'followers'>({
  key: 'numOfFollowerState',
  default: 0,
});

export default numOfFollowerState;
