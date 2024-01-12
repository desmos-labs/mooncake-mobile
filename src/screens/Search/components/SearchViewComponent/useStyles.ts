import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  wrapperView: { height: '100%', width: '100%' },
  absoluteView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.white,
    zIndex: 2,
  },
  searchView: { flex: 1, zIndex: 2 },
}));

export default useStyles;
