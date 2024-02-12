import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacings.m,
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingTop: theme.spacings.m,
    paddingBottom: theme.spacings.s,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    marginBottom: theme.spacings.s,
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    paddingBottom: theme.spacings.s,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.neutralVariants['200'],
    paddingHorizontal: -200,
  },
  paddingHorizontalM: {
    paddingHorizontal: theme.spacings.m,
  },
}));

export default useStyles;
