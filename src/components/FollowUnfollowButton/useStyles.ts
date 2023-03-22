import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  unfollowButton: {
    height: 32,
    minWidth: 80,
    backgroundColor: theme.colors.surfaceGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.roundness,
    marginTop: theme.spacing.s,
  },
  followButton: {
    height: 32,
    minWidth: 80,
    backgroundColor: theme.colors.surfaceBlack,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.roundness,
    marginTop: theme.spacing.s,
  },
}));

export default useStyles;
