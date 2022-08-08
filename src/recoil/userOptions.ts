import {atom} from 'recoil';
import {getMMKV, setMMKV, MMKVKEYS} from 'lib/MMKVStorage';
import {UserOptions} from 'types/userOptions';

/**
 * Recoil atom for profiles
 */
const userOptionsState = atom<UserOptions>({
  key: 'userOptions',
  default: (() => {
    return (
      getMMKV(MMKVKEYS.USER_OPTIONS) || {
        address: 'desmos1n39pwnwnsurvh8zcxwaahttmkvqtxqdmyaln7n',
        nickname: 'Donatello',
        dtag: '@don',
        bio: 'Ninja turtles to the moon!',
        profilePicture:
          'https://bbts1.azureedge.net/images/p/full/2020/10/07490a8f-220f-4c56-abe8-2dc70f84aea4.jpg',
      }
    );
  })(),
  effects: [
    ({onSet}) => {
      onSet(newUserOptions => {
        setMMKV(MMKVKEYS.USER_OPTIONS, newUserOptions);
      });
    },
  ],
});

export default userOptionsState;
