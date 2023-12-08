declare global {
  type LottieAnimation = {
    light: string;
    dark: string;
  };
}

export const broadcastAnim: LottieAnimation = {
  light: require("./animations/broadcastTx.json"),

  // TODO: REPLACE WITH DARK ANIMATION ONCE READY
  dark: require("./animations/broadcastTx.json"),
};

export const loadingYellow: LottieAnimation = {
  light: require("./animations/loading_yellow.json"),
  dark: require("./animations/loading_yellow.json"),
};
