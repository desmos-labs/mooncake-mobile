import React from 'react';
import {atom, useRecoilState, useResetRecoilState} from 'recoil';
import {
  getAppAuthorizations,
  getMMKV,
  MMKVKEYS,
  setAppAuthorizations,
} from 'lib/MMKVStorage';
import {APP_AUTHORIZATIONS} from 'lib/MMKVStorage/MMKVEnums';
import {useNavigation} from '@react-navigation/native';
import ROUTES from 'navigation/routes';

const appAuthorizationState = atom<AppAuthorizationType | undefined>({
  key: 'appAuthorization',
  default: undefined,
  effects: [
    ({trigger, setSelf}) => {
      if (trigger === 'get') {
        const activeAddress = getMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDR);

        setSelf(getAppAuthorizations(activeAddress as string));
      }
    },

    ({onSet}) => {
      onSet(newValue => {
        const activeAddress = getMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDR);

        setAppAuthorizations(activeAddress as string, {
          ...newValue,
        });
      });
    },
  ],
});

// Use the hook below to interact with this recoil atom

// eslint-disable-next-line import/prefer-default-export
export const useAppAuthorization = () => {
  const {navigate} = useNavigation<any>();

  const [authorizations, setAuthorizations] = useRecoilState(
    appAuthorizationState,
  );

  const resetAuthorizations = useResetRecoilState(appAuthorizationState);

  const requestAuthorization = React.useCallback(
    async (authorization: APP_AUTHORIZATIONS) => {
      // only show authorization dialog if user has not already allowed authorization

      if (authorizations && authorizations[authorization]) return;

      return new Promise(resolve => {
        navigate(ROUTES.ACTION_AUTHORIZATION, {
          authType: authorization,

          onCancel: () => {
            resolve(false);
          },

          onApprove: () => {
            setAuthorizations(prev => ({
              ...prev,
              [authorization]: true,
            }));
            resolve(true);
          },
        });
      });
    },
    [authorizations],
  );

  // TODO: Show dialog for remove authorization flow
  const removeAuthorization = React.useCallback(
    (authorization: APP_AUTHORIZATIONS) => {
      setAuthorizations(prev => ({
        ...prev,
        [authorization]: false,
      }));
    },
    [],
  );

  return {
    authorizations,
    requestAuthorization,
    removeAuthorization,
    resetAuthorizations,
  };
};
