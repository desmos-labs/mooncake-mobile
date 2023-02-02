import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.l,
    borderRadius: 12,
  },
  title: {
    color: theme.colors.surfaceBlack,
  },
  description: {
    marginTop: theme.spacing.s,
    color: theme.colors.midGrey,
  },
  icon: { width: 16, height: 16, marginLeft: theme.spacing.s },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: { right: 0, marginLeft: 'auto' },
}));

export default useStyles;
