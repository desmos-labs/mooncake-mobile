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
  roundness: 12,
  colors: {
    ...DefaultTheme.colors,
    // override default colors for compatibility with
    // default MUI colors

    // when using colors, try to use the custom ones below instead
    primary: '#F3725A',
    background: '#F7F8FA',
    surface: '#f9f9f9',
    accent: '#16CEEF',
    error: '#fd565f',

    desmosOrange01: '#F3725A',
    desmosOrange02: '#F69988',
    desmosOrange03: '#F9BBAC',
    desmosOrange04: '#FBD6D0',
    desmosOrange05: '#FBDBE7',

    desmosBlue01: '#16CEEF',
    desmosBlue02: '#59D8F3',
    desmosBlue03: '#88E6F7',
    desmosBlue04: '#ACEEF9',
    desmosBlue05: '#CFF5FC',
    desmosBlue06: '#E7FAFD',
    desmosBlue07: '#F7F8FA',

    pink01: '#F359A8',
    pink02: '#F9ACD4',
    pink03: '#FDDBEC',
    purple01: '#D758F3',
    purple02: '#E8A0F8',
    purple03: '#F4CFFC',
    yellow01: '#FFBE0D',
    yellow02: '#FFDF87',
    yellow03: '#FFF6DD',
    green01: '#A8F358',
    green02: '#C7F894',
    green03: '#E0FBC3',

    white: '#FFFFFF',
    backgroundGrey: '#F7F7F7',
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

    dOrangeGradient01: ['#FF3E9A', '#FFC75B', '#FF844F', '#FFD771'],
    dOrangeGradient02: ['#FF3E9A', '#FFC75B', '#FF844F', '#FFD771'].map(x =>
      addAlphaToHex(x, 0.5),
    ),
    dBlueGradient01: ['#3CB4B5', '#60BECF'],
    dBlueGradient02: ['#88E6F7', '#88F7E3'],
    dBlueGradient03: ['#DCFAFF', '#9BFFED'],
    pinkGradient: [addAlphaToHex('#F359A8', 0.24)],
    whiteGradient01: [addAlphaToHex('#FFFFFF', 0.1), '#ABC1FB'],
    blackGradient01: [
      addAlphaToHex('#000000', 0.4),
      addAlphaToHex('#FFFFFF', 0.1),
    ],
  },
};

export default LightTheme;
