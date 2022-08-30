import {atomFamily} from 'recoil';
import {StateType} from '.';

/* the page limit will be increase when we scroll to the bottom of the FlatList and there is more pages to load from server. */
const pageLimitState = atomFamily<number, StateType>({
  key: 'pageLimitState',
  default: 1,
});

export default pageLimitState;
