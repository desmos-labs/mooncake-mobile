import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.m,
  },
  sectionHeader: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.s,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    marginBottom: theme.spacing.s,
  },
}));

export default useStyles;
