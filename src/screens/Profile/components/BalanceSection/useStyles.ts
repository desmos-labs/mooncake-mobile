import {makeStyle} from 'config/theme';
import {verticalScale} from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingVertical: theme.spacing.m,
    height: verticalScale(140),
  },
  divider: {
    backgroundColor: theme.colors.surfaceGrey,
    height: 1,
    marginVertical: theme.spacing.m,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
}));

export default useStyles;
