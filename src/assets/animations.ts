declare global {
  type LottieAnimation = {
    light: string;

    dark: string;
  };
}

export const pairDevicesAnim: LottieAnimation = {
  light: require('./animations/pairDevicesLight.json'),
  dark: require('./animations/pairDevicesDark.json'),
};

export const lookingForDevicesAnimation: LottieAnimation = {
  light: require('./animations/lookingForDevicesLight.json'),
  dark: require('./animations/lookingForDevicesDark.json'),
};

export const unlockLedgerAnimation: LottieAnimation = {
  light: require('./animations/unlockLedger.json'),
  dark: require('./animations/unlockLedger.json'),
};

export const broadcastAnim: LottieAnimation = {
  light: require('./animations/broadcastTx.json'),

  // TODO: REPLACE WITH DARK ANIMATION ONCE READY
  dark: require('./animations/broadcastTx.json'),
};

export const buildingBlockAnim: LottieAnimation = {
  light: require('./animations/buildingBlocks.json'),
  dark: require('./animations/buildingBlocks.json'),
};
