import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  emptyImage: {
    width: 72,
    height: 72,
    resizeMode: 'cover',
    marginBottom: theme.spacings.s,
  },
  emptyView: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacings.m,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    paddingHorizontal: theme.spacings.m,
  },
}));

export default useStyles;
