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
  profileInfoView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pendingIcon: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 2,
    left: 'auto',
    right: 0,
  },
  mediaView: {
    alignItems: 'center',
    marginTop: theme.spacing.m,
  },
}));

export default useStyles;
