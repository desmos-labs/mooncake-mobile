import LightTheme from './LightTheme';

const DarkTheme: ReactNativePaper.Theme = {
  ...LightTheme,
  dark: true,
  colors: {
    ...LightTheme.colors,
    primary: '#C35B47',
    accent: '#407AEC',
    background: '#1D1E22',
    backgroundGrey: '#F7F7F7',
    surface: '#25282D',
    text: '#E6E6E6',
    disabled: '#9d9d9d',

    // hacky fix for black on black text when in storybook dark mode
    black: 'white',
  },
};

export default DarkTheme;
