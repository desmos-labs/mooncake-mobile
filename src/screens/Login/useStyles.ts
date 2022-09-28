import {makeStyle} from 'config/theme';
import {verticalScale} from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.m,
    paddingTop: verticalScale(40),
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    alignSelf: 'center',
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
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.0025,
    textAlign: 'center',
    color: theme.colors.white,
  },
  contentContainer: {
    flex: 0.5,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  bottomContentContainer: {
    flex: 0.5,
    justifyContent: 'flex-end',
  },
  labelStyle: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.s,
    color: theme.colors.white,
  },
  forgotPwButton: {
    alignSelf: 'center',
  },
  errorStyle: {
    marginTop: theme.spacing.s,
    color: theme.colors.white,
  },
}));

export default useStyles;
