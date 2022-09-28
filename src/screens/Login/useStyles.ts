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
    fontSize: 28,
    lineHeight: 42,
    textAlign: 'center',
    color: theme.colors.white,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 42,
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
}));

export default useStyles;
