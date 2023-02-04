import {makeStyle} from 'config/theme';
import {verticalScale} from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  // inactiveDotColor: surface1,
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
  },
  container: {
    flex: 1,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.white,
  },
  headerStyle: {
    color: theme.colors.surfaceBlack,
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  descriptionStyle: {
    marginHorizontal: theme.spacing.m,
    color: theme.colors.surfaceBlack,
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
    flex: 1,
    marginTop: 22,
  },
  noDevicesText: {
    color: theme.colors.surfaceBlack,
  },
  noDeviceImage: {
    width: 110,
    height: 110,
    redizeMode: 'contain',
  },
  retryButton: {
    marginTop: theme.spacing.xl,
    marginHorizontal: theme.spacing.m,
  },
  contentContainer: {
    flexGrow: 1,
    padding: theme.spacing.m,
  },
}));

export default useStyles;
