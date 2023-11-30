import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { MMKVKEYS, getMMKV, setMMKV } from 'lib/MMKVStorage';
import { LoginFlowState, LoginFlowStep } from 'types/login';

/**
 * Atom that contains the login flow state.
 */
const loginFlowAppState = atom<LoginFlowState>({
  key: 'loginFlowAppState',
  default: (() => {
    const storedValue = getMMKV<LoginFlowState>(MMKVKEYS.LOGIN_FLOW_STATE);
    if (storedValue !== undefined) {
      return storedValue;
    }

    // The login flow state is undefined, so let's check if there is an active account
    // address stored to handle the case where a user was logged in and
    // performed an upgrade.
    const activeAccountAddress = getMMKV<string>(MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS);
    // If we have a non empty address means that the user was logged in.
    const loginStep =
      activeAccountAddress === undefined || activeAccountAddress === ''
        ? LoginFlowStep.None
        : LoginFlowStep.Completed;
    return { step: loginStep };
  })(),
  effects: [
    ({ onSet }) => {
      onSet(state => {
        setMMKV(MMKVKEYS.LOGIN_FLOW_STATE, state);
      });
    },
  ],
});

/**
 * Hook that rrovides the login flow state.
 */
export const useLoginFlowState = () => useRecoilValue(loginFlowAppState);

/**
 * Hook that provides a function to update the login flow state.
 */
export const useSetLoginFlowState = () => useSetRecoilState(loginFlowAppState);
