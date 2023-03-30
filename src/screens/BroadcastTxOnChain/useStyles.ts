import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.m,
  },
}));

export default useStyles;
