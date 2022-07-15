import {atom} from 'recoil';
import {getMMKV, setMMKV, MMKVKEYS} from 'lib/MMKVStorage';
import DesmosProfile from 'types/desmosProfile';

/**
 * Recoil atom for profiles
 */
const profilesState = atom<DesmosProfile[]>({
  key: 'profiles',
  default: (() => {
    const savedProfiles = getMMKV(MMKVKEYS.PROFILES);

    return (
      savedProfiles || [
        {
          address: '123',
          nickname: 'Donatello',
          dtag: '@don',
          bio: 'Ninja turtles to the moon!',
          profilePicture:
            'https://bbts1.azureedge.net/images/p/full/2020/10/07490a8f-220f-4c56-abe8-2dc70f84aea4.jpg',
        },
        {
          address: '12345',
          nickname: 'Michelangelo',
          dtag: '@mic',
          bio: 'Ninja turtles to the moon!',
          profilePicture: 'https://wallpaperaccess.com/full/196551.jpg',
        },
      ]
    );
  })(),
  effects: [
    ({onSet}) => {
      onSet(newProfiles => {
        setMMKV(MMKVKEYS.PROFILES, newProfiles);
      });
    },
  ],
});

export default profilesState;
