import {makeStyle} from 'config/theme';
import {verticalScale} from 'react-native-size-matters';

/**
 * Style hook for the ConnectToLedger screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.m,
    paddingTop: 80,
  },
  image: {
    width: '60%',
    height: '30%',
    alignSelf: 'center',
  },
  centeredGroup: {
    alignSelf: 'center',
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
    color: theme.colors.desmosOrange01,
  },
}));

export default useStyles;
