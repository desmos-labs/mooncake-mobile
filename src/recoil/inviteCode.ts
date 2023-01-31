import {atom, useRecoilValue, useSetRecoilState} from 'recoil';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';

/**
 * Recoil atom for the invite code.
 */
const inviteCodeState = atom<string | undefined>({
  key: 'inviteCodeState',
  default: getMMKV(MMKVKEYS.INVITE_CODE),
  effects: [
    ({onSet}) => {
      onSet(inviteCode => {
        setMMKV(MMKVKEYS.INVITE_CODE, inviteCode);
      });
    },
  ],
});

/**
 * Hook to set the invite code.
 */
export const useSetInviteCode = () => useSetRecoilState(inviteCodeState);

/**
 * Hook to get the currently set invite code.
 */
export const useInviteCode = () => useRecoilValue(inviteCodeState);
