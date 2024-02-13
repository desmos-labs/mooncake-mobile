import { makeStyle } from 'config/theme';
import { scale } from 'react-native-size-matters';

/**
 * Theme hook for the PostCard component
 */
const useStyles = makeStyle(theme => ({
  bottomBarView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacings.m,
    justifyContent: 'space-between',
  },
  bottomBarIcon: { height: scale(22), width: scale(22), marginRight: theme.spacings.xs },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacings.s,
    marginLeft: theme.spacings.l,
  },
  bottomBarInnerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacings.s,
  },
  leftButtonsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default useStyles;
