import {makeStyle} from 'config/theme';
import {verticalScale} from 'react-native-size-matters';

/**
 * Style hook for the ConnectToLedger screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.m,
  },
  image: {
    width: '60%',
    height: '30%',
    alignSelf: 'center',
  },
  lottieAnimation: {
    alignSelf: 'center',
  },
  centeredGroup: {
    alignSelf: 'center',
    marginBottom: 60,
  },
  status: {
    marginTop: theme.spacing.m,
    textAlign: 'center',
    alignSelf: 'center',
  },
  errorMessage: {
    marginTop: theme.spacing.m,
    color: theme.colors.error,
    textAlign: 'center',
    alignSelf: 'center',
  },
  headerText: {
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  ledgerImage: {
    width: 240,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  errorImage: {
    width: '100%',
    height: verticalScale(100),
    resizeMode: 'contain',
  },
  howToDLText: {
    marginTop: theme.spacing.l,
    marginHorizontal: theme.spacing.m,
    color: theme.colors.butterOrange01,
  },
  crossIcon: {height: 24, width: 24, right: 0, marginLeft: 'auto'},
}));

export default useStyles;
