import {DefaultTheme} from 'react-native-paper';
import {addAlphaToHex} from 'config/theme/index';

const LightTheme: ReactNativePaper.Theme = {
  ...DefaultTheme,
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  roundness: 14,
  colors: {
    ...DefaultTheme.colors,
    // override default colors for compatibility with
    // default MUI colors

    // when using colors, try to use the custom ones below instead
    primary: '#FEB027',
    background: '#F7F8FA',
    surface: '#EFEFEF',
    accent: '#16CEEF',
    error: '#FD565F',

    butterOrange01: '#FEB027',
    butterOrange02: '#FEC054',
    butterOrange03: '#FED792',
    butterOrange04: '#FFE8C1',
    butterOrange05: '#FFF3E0',

    butterYellow01: '#FDD327',
    butterYellow02: '#FDDF64',
    butterYellow03: '#FEE892',
    butterYellow04: '#FEF2C1',
    butterYellow05: '#FFFCEF',

    pink01: '#F359A8',
    pink02: '#F9ACD4',
    pink03: '#FDDBEC',
    purple01: '#A658F3',
    purple02: '#CC9FFB',
    purple03: '#EAD8FE',
    red01: '#FF5F38',
    red02: '#FFAF9C',
    red03: '#FFE8E3',
    orange01: '#FF8024',
    orange02: '#FFC398',
    orange03: '#FFE3CF',

    white: '#FFFFFF',
    backgroundGrey: '#F7F7F7',
    backgroundBlue: '#F7F8FA',
    surfaceGrey: '#EFEFEF',
    lightGrey01: '#DDDDDD',
    lightGrey02: '#C2C2C2',
    iconGrey: '#AFAFAF',
    grey01: '#9D9D9D',
    grey02: '#878787',
    midGrey: '#616161',
    darkGrey: '#34383E',
    surfaceBlack: '#25282D',
    black: '#1D1E22',
    dividerGrey: '#EFEFEF',

    accentRed01: '#FD565F',
    accentRed02: '#6061E4',
    accentOrange01: '#FCBB36',
    accentOrange02: '#B484EA',
    accentYellow01: '#EDD500',
    accentYellow02: '#B1B1F2',
    accentGreen01: '#1EC490',
    accentGreen02: '#8A75DE',
    accentLightBlue01: '#FF9C8F',
    accentLightBlue02: '#4D2FC2',
    accentBlue01: '#FF8272',
    accentBlue02: '#362187',

    // Gradients to be checked
    butterOrangeGradient01: [
      'rgba(236, 140, 0, 1)',
      'rgba(255, 196, 82, 1)',
      'rgba(255, 228, 175, 1)',
    ],
    butterOrangeGradient02: [
      'rgba(254, 176, 39, 1)',
      'rgba(255, 245, 243, 0)',
    ].map(x => addAlphaToHex(x, 0.5)),
    butterYellowGradient: ['rgba(255, 159, 18, 1)', 'rgba(248, 218, 64, 1)'],
    pinkGradient: [addAlphaToHex('#F359A8', 0.24)],
    whiteGradient01: [addAlphaToHex('#FFFFFF', 0.1), '#ABC1FB'],
    blackGradient01: [
      addAlphaToHex('#000000', 0.4),
      addAlphaToHex('#FFFFFF', 0.1),
    ],
  },
};

export default LightTheme;
