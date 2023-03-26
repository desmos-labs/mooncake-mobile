import { makeStyle } from 'config/theme';
import { Dimensions } from 'react-native';

/**
 * Theme hook for the PostCard component
 */
const useStyles = makeStyle(theme => ({
  container: {
    alignSelf: 'center',
    width: Dimensions.get('window').width,
    padding: theme.spacing.m,
  },
  profilePic: {
    height: 48,
    width: 48,
    alignSelf: 'center',
    borderRadius: 24,
    marginRight: theme.spacing.s,
    backgroundColor: theme.colors.background,
  },
  bottomBarView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.m,
    justifyContent: 'space-between',
  },
  bottomBarIcon: { height: 24, width: 24, marginRight: theme.spacing.xs },
  profileInfoView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.s,
    marginLeft: theme.spacing.l,
  },
  pendingIcon: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 2,
    left: 'auto',
    right: 0,
  },
  bottomBarInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaView: {
    alignItems: 'center',
    marginTop: theme.spacing.m,
  },
  tipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.s,
  },
}));

export default useStyles;
