import {makeStyle} from 'config/theme';

/**
 * Style hook for the InteractionButton component
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
  },
  countText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.white,
  },
}));

export default useStyles;
