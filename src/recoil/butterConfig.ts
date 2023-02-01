import {atom, useRecoilValue, useSetRecoilState} from 'recoil';
import {ButterConfig} from 'types/butter';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';

/**
 * A recoil atom used to store the config details of
 * the Butter app retrieved from the APIs.
 */
const butterConfigState = atom<ButterConfig | undefined>({
  key: 'butterConfigState',
  default: getMMKV(MMKVKEYS.BUTTER_CONFIG),
  effects: [
    ({onSet}) => {
      onSet(config => {
        setMMKV(MMKVKEYS.BUTTER_CONFIG, config);
      });
    },
  ],
});

/**
 * A hook to update the current Butter config state.
 */
export const useSetButterConfig = () => useSetRecoilState(butterConfigState);

/**
 * A hook that exposes the current Butter config state.
 */
export const useStoredButterConfig = () => useRecoilValue(butterConfigState);
