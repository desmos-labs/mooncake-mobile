import {makeStyle} from 'config/theme';

/**
 * Style hook for the PostReactions screen
 */
const useStyles = makeStyle(theme => ({
  countText: {
    color: theme.colors.midGrey,
    paddingLeft: theme.spacing.m,
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.m,
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
}));

export default useStyles;
