import { atom, selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import React from 'react';
import { SubspaceParams } from 'types/desmos';
import { AppStateStatus } from 'react-native';
import { ButterConfig } from 'types/butter';
import { HomeTabsParams } from 'navigation/RootNavigator/HomeTabs';
import ROUTES from 'navigation/routes';
import Constants from 'config/Constants';

/**
 * Contains the overall state of the application.
 */
interface AppState {
  /**
   * Whether the application data has been initialized or not.
   */
  readonly dataInitialized: boolean;
  /**
   * Current application state.
   */
  readonly appActiveState: AppStateStatus;
  /**
   * Token that should be used when authenticating the APIs calls.
   */
  readonly bearerToken: string;
  /**
   * ID of the subspace that the app is currently using.
   */
  readonly subspaceId: number;
  /**
   * User timezone.
   */
  readonly currentTimezone: string;
  /**
   * Parameters of the subspace currently used by the application.
   */
  readonly subspaceParams: SubspaceParams;
  /**
   * Configuration fetched from the GraphQL APIs.
   */
  readonly butterConfig: ButterConfig | undefined;
  /**
   * Overall count of the notifications sent to the application.
   */
  readonly notificationsCount: number;
  /**
   * Last tab that the user has opened in the home screen.
   */
  readonly lastHomeTab: HomeTabsParams['initialRouteName'];
  /**
   * Whether the user has given consent to agree to the Terms of Conditions and Privacy Policy.
   */
  readonly consentGiven: boolean;
  /**
   * List of account addresses that the user has selected in the
   * FollowCreators screen during the onboarding process, but the
   * transaction failed, and we should try to send the transaction again.
   */
  readonly failedToFollowCreators: string[];
}

const DefaultAppState: AppState = {
  dataInitialized: false,
  bearerToken: '',
  appActiveState: 'unknown',
  subspaceId: Constants.subspaceId,
  currentTimezone: '',
  subspaceParams: {
    reportReasons: [],
  },
  butterConfig: undefined,
  notificationsCount: 0,
  lastHomeTab: ROUTES.HOME_TAB_DISCOVER,
  consentGiven: false,
  failedToFollowCreators: [],
};

const appState = atom<AppState>({
  key: 'appState',
  default: (() => {
    const mmkvValue = getMMKV(MMKVKEYS.APP_STATE);
    return {
      // Overwrite the default values with the ones stored in MMKV
      // so that if we extend the app state the new values will
      // default to the values declared in DefaultAppState.
      ...DefaultAppState,
      ...mmkvValue,
    };
  })(),
  effects: [
    ({ onSet }) => {
      onSet(state => {
        setMMKV(MMKVKEYS.APP_STATE, state);
      });
    },
  ],
});

/**
 * Recoil that allows to select a single app state value.
 */
const appStateValue = selectorFamily({
  key: 'appStateValue',
  get:
    (key: keyof AppState) =>
    ({ get }) => {
      const appStateFields = get(appState);
      return appStateFields[key];
    },
});

/**
 * Hook that allows to observe only a single appState field.
 * @param appStateKey - Key associated to the appState that needs to be retrieved.
 * @return The value of the appState associated with the given key.
 */
export const useAppStateValue = <K extends keyof AppState>(appStateKey: K) =>
  useRecoilValue(appStateValue(appStateKey)) as AppState[K];

/**
 * Hook that provides a function to update the value of a appState field.
 * @param appStateKey - Key of the appState field of interest.
 */
export const useSetAppStateValue = <K extends keyof AppState>(appStateKey: K) => {
  const setAppState = useSetRecoilState(appState);
  return React.useCallback(
    (valueOrUpdater: ((current: AppState[K]) => AppState[K]) | AppState[K]) => {
      setAppState(currentValue => {
        const newState: AppState = {
          ...currentValue,
        };

        let newValue: AppState[K];
        if (typeof valueOrUpdater === 'function') {
          newValue = valueOrUpdater(currentValue[appStateKey]);
        } else {
          newValue = valueOrUpdater;
        }

        newState[appStateKey] = newValue;
        return newState;
      });
    },
    [appStateKey, setAppState],
  );
};

/**
 * Hook that allows to set the entire values of {@link AppState}.
 *
 * <b>Note</b>
 * By using this hook, you will cause a refresh on all the hooks that also
 * depedend on individual values. If you need to update a single value, use
 * {@link useSetAppStateValue} instead.
 */
export const useSetAppState = () => useSetRecoilState(appState);
