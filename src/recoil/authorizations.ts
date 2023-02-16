import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { AuthorizationsInformation } from 'types/authorizations';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { RequiredAuthzGrants } from 'config/AutzGrants';
import React from 'react';

const DefaultAuthorizationInfo: AuthorizationsInformation = {
  feeGrants: [],
  authz: {
    grants: [],
  },
  missingAuthzPermissions: RequiredAuthzGrants,
  missingFeeGrantPermissions: RequiredAuthzGrants,
};

/**
 * Atom that holds the last authorization information retrieved.
 */
const authorizationsState = atom<Record<string, AuthorizationsInformation>>({
  key: 'authorizationsState',
  default: getMMKV(MMKVKEYS.AUTHORIZATIONS) ?? {},
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
 * Hook that allows to get the account's authorizations' info.
 * @param accountAddress - Account address.
 */
export const useStoreAccountAuthorizations = (accountAddress: string) => {
  const setAuthorizations = useStoreAuthorizationsInfo();

  return React.useCallback(
    (
      authInfo:
        | ((currVal: AuthorizationsInformation) => AuthorizationsInformation)
        | AuthorizationsInformation,
    ) => {
      setAuthorizations(currVal => {
        const accountAuthorizations = currVal[accountAddress];
        let newVal: AuthorizationsInformation | undefined;
        if (typeof authInfo === 'function') {
          newVal = authInfo(accountAuthorizations ?? DefaultAuthorizationInfo);
        } else {
          newVal = authInfo;
        }

        if (newVal !== accountAuthorizations) {
          return {
            ...currVal,
            [accountAddress]: newVal,
          };
        } else {
          return currVal;
        }
      });
    },
    [accountAddress, setAuthorizations],
  );
};

/**
 * Hook that allows to get the currently stored authorizations info.
 */
export const useStoredAuthorizationInfo = () => useRecoilValue(authorizationsState);

/**
 * Hook that allows to get the currently stored authorizations info of an account.
 */
export const useStoredAccountAuthorizationsInfo = (accountAddress: string) => {
  const storedAuthorizations = useStoredAuthorizationInfo();

  return React.useMemo(() => {
    return storedAuthorizations[accountAddress] ?? DefaultAuthorizationInfo;
  }, [storedAuthorizations, accountAddress]);
};
