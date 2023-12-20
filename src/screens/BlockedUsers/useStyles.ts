import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  emptyImage: {
    width: 72,
    height: 72,
    resizeMode: 'cover',
    marginBottom: theme.spacing.s,
  },
  emptyView: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.m,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    paddingHorizontal: theme.spacing.m,
  },
}));

export default useStyles;
