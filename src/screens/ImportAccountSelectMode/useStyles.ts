import { makeStyle } from 'config/theme';
import { verticalScale } from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    alignItems: 'center',
    flex: 1,
    padding: theme.spacing.m,
    paddingTop: verticalScale(40),
  },
}));

export default useStyles;
