import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  wrapperView: { height: '100%', width: '100%' },
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.m,
    backgroundColor: theme.colors.white,
  },
  searchView: { flex: 1, zIndex: 2 },
}));

export default useStyles;
