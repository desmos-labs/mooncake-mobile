import { atom, selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import React from 'react';
import { SubspaceParams } from 'types/desmos';
import EnvConfig from 'config/EnvConfig';
import { AppStateStatus } from 'react-native';

/**
 * Contains the overall state of the application.
 */
export interface AppState {
  /**
   * Whether the application data has been initialized or not.
   */
  readonly dataInitialized: boolean;
  /**
   * Current application state.
   */
  readonly appActiveState: AppStateStatus;
  /**
   * Id of the subspace that the app is currently using.
   */
  readonly subspaceId: number;
  /**
   * Whether the user has given the consent to the Butter ToS and Privacy or not.
   */
  readonly consentGiven: boolean;
  /**
   * Invitation code that the user has used in order .
   */
  readonly inviteCode: string | undefined;
  /**
   * User timezone.
   */
  readonly currentTimezone: string;
  /**
   * Parameters of the subspace currently used by the application.
   */
  readonly subspaceParams: SubspaceParams;
  /**
   * Overall count of the notifications sent to the application.
   */
  readonly notificationsCount: number;
}

const DefaultAppState: AppState = {
  appActiveState: 'unknown',
  subspaceId: EnvConfig.APP_SUBSPACE_ID,
  consentGiven: false,
  inviteCode: undefined,
  dataInitialized: false,
  currentTimezone: '',
  subspaceParams: {
    registeredReactions: [],
    reportReasons: [],
    tipsContractConfig: {
      serviceFeePercentage: 0.0,
    },
  },
  notificationsCount: 0,
};

const appState = atom<AppState>({
  key: 'appState',
  default: getMMKV(MMKVKEYS.APP_STATE) ?? DefaultAppState,
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
