import { addAlphaToHex } from 'config/theme/index';
import { extendTheme } from 'native-base';

export const baseSpacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

/**
 * A custom theme created by extending native-base base theme. Some colors retain their material-ui names as they were
 * imported from the previous material-ui stylesheet.
 */
export const lightTheme = extendTheme({
  // legacy spacing keys for styles that still use react-native-paper naming
  spacing: baseSpacing,
  // duplicated spacings for native-base compatibility
  space: baseSpacing,
  fontConfig: {
    Poppins: {
      400: {
        normal: 'Poppins_400Regular',
        italic: 'Poppins_400Regular_Italic',
      },
      600: {
        normal: 'Poppins_600SemiBold',
        italic: 'Poppins_600SemiBold_Italic',
      },
      700: {
        normal: 'Poppins-Bold',
        italic: 'Poppins_700Bold_Italic',
      },
      800: {
        normal: 'Poppins_800ExtraBold',
        italic: 'Poppins_800ExtraBold_Italic',
      },
      900: {
        normal: 'Poppins_900Black',
        italic: 'Poppins_900Black_Italic',
      },
    },
  },
  roundness: 12,
  colors: {
    primary: '#FEB027',
    background: '#FFF',
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
    tabIconGrey: '#DEDEDE',

    accentRed01: '#FD565F',
    accentRed02: '#D2484F',
    accentOrange01: '#FCBB36',
    accentOrange02: '#E4A11E',
    accentYellow01: '#EDD500',
    accentYellow02: '#DEC053',
    accentGreen01: '#1EC490',
    accentGreen02: '#059C78',
    accentLightBlue01: '#2DCBE0',
    accentLightBlue02: '#30B5C7',
    accentBlue01: '#007FFF',
    accentBlue02: '#0767C9',

    // Gradients to be checked
    butterOrangeGradient01: [
      'rgba(236, 140, 0, 1)',
      'rgba(255, 196, 82, 1)',
      'rgba(255, 228, 175, 1)',
    ],
    butterOrangeGradient02: ['rgba(254, 176, 39, 1)', 'rgba(255, 245, 243, 0)'].map(x =>
      addAlphaToHex(x, 0.5),
    ),
    butterYellowGradient: ['rgba(255, 159, 18, 1)', 'rgba(248, 218, 64, 1)'],
    pinkGradient: [addAlphaToHex('#F359A8', 0.24)],
    whiteGradient01: [addAlphaToHex('#FFFFFF', 0.1), '#ABC1FB'],
    blackGradient01: [addAlphaToHex('#000000', 0.4), addAlphaToHex('#FFFFFF', 0.1)],
  },
  components: {
    Button: {
      baseStyle: {
        _pressed: {
          opacity: 0.4,
        },
        _hover: {
          opacity: 0.8,
        },
        opacity: 1,
        rounded: 14,
      },
    },
  },
});

// Extend native-base ICustomTheme interface for typescript support.
export type CustomThemeType = typeof lightTheme;

declare module 'native-base' {
  interface ICustomTheme extends CustomThemeType {}
}

export default lightTheme;
