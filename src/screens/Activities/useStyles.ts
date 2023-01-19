import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingTop: theme.spacing.m,
  },
  flexCenter: {
    flex: 1,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
  },
  sectionHeader: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingTop: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.s,
  },
  emptyView: {
    paddingHorizontal: theme.spacing.m,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginVertical: theme.spacing.s,
  },
}));

export default useStyles;
