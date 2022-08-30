import {atom} from 'recoil';

/**
 * @property {number} subspaceID - The subspace ID of the app.
 * @property {string} userAddress - The address of the user whose following and followers you want to
 * fetch.
 * @property {string} cacheKey - Passing the diff cacheKey from upstream will load data without cache.
 */
export type RouteState = {
  subspaceID: number;
  userAddress: string;
  cacheKey: string;
};

/* The state of the following and followers screen. */
const routeState = atom<RouteState>({
  key: 'keysState',
  default: {subspaceID: 0, userAddress: '', cacheKey: ''},
});

export default routeState;
