import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    paddingBottom: theme.spacing.s,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.dividerGrey,
    paddingHorizontal: -200,
  },
  paddingHorizontalM: {
    paddingHorizontal: theme.spacing.m,
  },
}));

export default useStyles;
