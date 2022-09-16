import {makeStyle} from 'config/theme';
import {verticalScale} from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    alignItems: 'center',
    flex: 1,
    padding: theme.spacing.m,
    paddingTop: verticalScale(40),
  },
  dummyAvatar: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
  },
  title: {
    color: theme.colors.white,
    fontFamily: 'Poppins-Regular',
    fontSize: 28,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 42,
    letterSpacing: 0.0025,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    marginBottom: 50,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.0025,
    textAlign: 'center',
    color: theme.colors.white,
  },
  connectLedgerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectLedgerImage: {
    width: 24,
    height: 20,
    resizeMode: 'contain',
    marginRight: theme.spacing.s,
  },
}));

export default useStyles;
