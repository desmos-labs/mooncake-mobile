import { AccountInfo } from 'types/account';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';

const accountInfo = atom<AccountInfo>({
  key: 'accountInfo',
  default: getMMKV(MMKVKEYS.ACCOUNT_INFO) || undefined,
  effects: [
    ({ onSet }) => {
      onSet(newAccountInfo => {
        setMMKV(MMKVKEYS.ACCOUNT_INFO, newAccountInfo);
      });
    },
  ],
});

export const useStoredAccountInfo = () => useRecoilValue(accountInfo);

export const useStoreAccountInfo = () => useSetRecoilState(accountInfo);
