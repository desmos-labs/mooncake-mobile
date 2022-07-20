import {makeStyle} from 'config/theme';
import {verticalScale} from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  // inactiveDotColor: surface1,
  container: {
    padding: theme.spacing.m,
  },
  headerStyle: {
    color: theme.colors.black,
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  descriptionStyle: {
    color: theme.colors.black,
    textAlign: 'center',
  },
  warningStyle: {
    color: theme.colors.accentBlue02,
    textAlign: 'center',
    marginTop: 30,
  },
  graphicGroup: {
    paddingTop: verticalScale(48),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btDeviceImg: {
    width: 45.3,
    height: 79.6,
    resizeMode: 'contain',
    marginRight: 8,
  },
  ledgerImg: {
    width: 13,
    height: 72.3,
    resizeMode: 'contain',
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 22,
  },
  flatlistContainer: {
    marginTop: 22,
  },
  noDevicesText: {
    color: theme.colors.desmosOrange01,
  },
  noDeviceImage: {
    width: 110,
    height: 110,
    redizeMode: 'contain',
  },
  retryButton: {
    color: theme.colors.white,
    marginTop: theme.spacing.xl,
  },
  contentContainer: {
    flexGrow: 1,
    padding: theme.spacing.m,
  },
}));

export default useStyles;
