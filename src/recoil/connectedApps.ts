import {atom} from 'recoil';

// eslint-disable-next-line import/prefer-default-export
export const connectedAppsState = atom<ConnectedApps[]>({
  key: 'connectedApps',
  default: [],
});
