import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  inviteIconContainer: { position: 'absolute', left: 'auto', right: 0 },
  cancelIconContainer: {
    marginLeft: theme.spacing.m,
    position: 'absolute',
    left: 'auto',
    right: 14,
  },
  container: {
    marginTop: theme.spacing.xs,
    paddingBottom: theme.spacing.s,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.white,
  },
  animatedView: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    marginTop: theme.spacing.xs,
    justifyContent: 'center',
  },
  rightButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.xs,
  },
  icon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
}));

export default useStyles;
