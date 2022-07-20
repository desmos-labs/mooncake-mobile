import {makeStyle} from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.m,
  },
  image: {
    width: 213.84,
    height: 125.04,
    alignSelf: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
}));

export default useStyles;
