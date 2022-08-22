declare global {
  type LottieAnimation = {
    light: string;

    dark: string
  }
}

export const pairDevicesAnim: LottieAnimation = {
  light: require('./animations/pairDevicesLight.json'),
  dark: require('./animations/pairDevicesDark.json')
}

export const broadcastAnim: LottieAnimation = {
  light: require('./animations/broadcast-tx-light.json'),

  // TODO: REPLACE WITH DARK ANIMATION ONCE READY
  dark: require('./animations/broadcast-tx-light.json'),
}

export const buildingBlockAnim: LottieAnimation = {
  light: require('./animations/buildingBlocks.json'),
  dark: require('./animations/buildingBlocks.json')
}
