declare global {
  type LottieAnimation = {
    light: string;
    dark: string;
  };
}

export const dotsAnimation: LottieAnimation = {
  light: require ('./animations/dotsAnimation.json'),
  
  // TODO: REPLACE WITH DARK ANIMATION ONCE READY
  dark: require ('./animations/dotsAnimation.json'),
};

export const squaresAnimation: LottieAnimation = {
  light: require ('./animations/squaresAnimation.json'),
  dark: require ('./animations/squaresAnimation.json'),
};
