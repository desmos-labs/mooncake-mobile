import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { AuthorizationsInformation } from 'types/authorizations';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';

const DefaultAuthorizationInfo: AuthorizationsInformation = {
  feeGrant: {
    hasFeeGrant: false,
  },
  authz: {
    grants: [],
  },
};

/**
 * Atom that holds the last authorization information retrieved.
 */
const authorizationsState = atom<AuthorizationsInformation>({
  key: 'authorizationsState',
  default: getMMKV(MMKVKEYS.AUTHORIZATIONS) ?? DefaultAuthorizationInfo,
  effects: [
    ({ onSet }) => {
      onSet(info => {
        setMMKV(MMKVKEYS.AUTHORIZATIONS, info);
      });
    },
  ],
});

/**
 * Hook that allows to set the authorizations' info.
 */
export const useStoreAuthorizationsInfo = () => useSetRecoilState(authorizationsState);

/**
 * Hook that allows to get the currently stored authorizations info.
 */
export const useStoredAuthorizationInfo = () => useRecoilValue(authorizationsState);
