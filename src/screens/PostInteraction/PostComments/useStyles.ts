import {makeStyle} from 'config/theme';

/**
 * Style hook for the PostComment screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    padding: theme.spacing.m,
  },
}));

export default useStyles;
