import { makeStyle } from 'config/theme';
import { verticalScale } from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: 20,
  },
  innerView: {
    alignItems: 'center',
    marginTop: verticalScale(100),
  },
  animation: {
    width: 88,
    height: 88,
  },
  mooncakeText: {
    width: 147,
    height: 24,
  },
  loginButton: {
    width: '100%',
  },
  loginTextWithLogoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginLogo: {
    width: 40,
    height: 40,
  },
}));

export default useStyles;
