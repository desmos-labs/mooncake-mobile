import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  unfollowButton: {
    height: 32,
    backgroundColor: theme.colors.surfaceGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.roundness,
  },
  followButton: {
    height: 32,
    backgroundColor: theme.colors.surfaceBlack,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.roundness,
  },
}));

export default useStyles;
