import {device} from 'detox';

// We can define a timeout, could be 10 seconds

// Detox config typing
type DetoxLaunchAppConfig = Parameters<typeof device.launchApp>[0];

const launchAppConfig: DetoxLaunchAppConfig = {
  permissions: {
    notifications: 'YES',
    camera: 'YES',
    photos: 'YES',
    faceid: 'YES',
  },
  newInstance: true,
};

export default launchAppConfig;
