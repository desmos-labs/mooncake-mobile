import { makeStyle } from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: { flex: 1, paddingTop: theme.spacing.xl },
  pager: { flex: 0.7 },
  bottomItems: { flex: 0.3 },
  itemView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.m,
  },
  image: { height: 225, width: 260, marginBottom: theme.spacing.l, marginTop: 50 },
  dotView: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 60,
  },
  dotStyle: {
    width: 8,
    height: 8,
    marginHorizontal: 6,
  },
  topBar: {
    zIndex: 2,
  },
  onboardingLogo: {
    width: 114,
    height: 21,
    alignSelf: 'center',
  },
  button: {
    marginHorizontal: theme.spacing.m,
  },
}));

export default useStyles;
