import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  homeView: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingTop: theme.spacing.m,
    zIndex: 1,
  },
  tweetsList: {
    flex: 1,
  },
  flatlistInner: {
    flexGrow: 1,
  },
  absoluteView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.white,
    zIndex: 2,
  },
  loadingView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  loaderView: { flex: 1, marginHorizontal: theme.spacing.m },
  searchView: { flex: 1, zIndex: 2 },
  emptyImage: {
    width: 72,
    height: 72,
    resizeMode: 'cover',
    marginBottom: theme.spacing.s,
  },
  emptyView: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default useStyles;
