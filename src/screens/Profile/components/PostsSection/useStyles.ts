import { makeStyle } from 'config/theme';
import { verticalScale } from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: { flex: 1, paddingVertical: theme.spacing.m },
  button: {
    marginTop: theme.spacing.m,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  emptyImage: { height: 80, width: 80, marginBottom: theme.spacing.s },
  flatlistContainer: {
    alignItems: 'center',
    flexGrow: 1,
  },
  activityIndicatorView: { height: verticalScale(145), justifyContent: 'center' },
}));

export default useStyles;
