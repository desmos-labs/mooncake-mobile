import { makeStyle } from 'config/theme';
import { scale } from 'react-native-size-matters';

/**
 * Theme hook for the PostCard component
 */
const useStyles = makeStyle(theme => ({
  bottomBarView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.m,
    justifyContent: 'space-between',
  },
  bottomBarIcon: { height: scale(22), width: scale(22), marginRight: theme.spacing.xs },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.s,
    marginLeft: theme.spacing.l,
  },
  bottomBarInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.s,
  },
}));

export default useStyles;
