import {makeStyle} from 'config/theme';

/**
 * Style hook for the MenuButton component
 */
const useStyles = makeStyle(theme => ({
  container: {
    height: 80,
    width: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: theme.colors.butterYellow01,
  },
  countText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.butterYellow01,
  },
}));

export default useStyles;
