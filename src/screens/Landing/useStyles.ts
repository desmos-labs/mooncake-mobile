import { makeStyle } from 'config/theme';
import { verticalScale } from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    alignItems: 'center',
    flex: 1,
    padding: theme.spacing.m,
    paddingTop: verticalScale(40),
  },
  dummyAvatar: {
    width: 150,
    height: 133,
    resizeMode: 'contain',
    marginBottom: -theme.spacing.s,
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
  loginWithContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  invitedLabel: {
    marginVertical: theme.spacing.m,
    color: theme.colors.white,
  },
  loginWithLabel: {
    color: theme.colors.white,
  },
  loginDivider: {
    flex: 1,
    backgroundColor: theme.colors.white,
    height: 1,
  },
  loginLogo: {
    width: 44,
    height: 44,
    marginHorizontal: 10,
  },
  bottomIcons: {
    flexDirection: 'row',
    marginTop: theme.spacing.l,
  },
}));

export default useStyles;
