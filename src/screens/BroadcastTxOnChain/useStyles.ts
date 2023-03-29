import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    flex: 1,
  },
  scrollviewContentContainer: {
    paddingHorizontal: theme.spacing.m,
  },
}));

export default useStyles;
