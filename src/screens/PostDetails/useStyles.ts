import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    backgroundColor: theme.colors.white,
  },
  sceneContainerStyle: {
    backgroundColor: theme.colors.white,
  },
  flatListContainer: {
    paddingHorizontal: theme.spacing.m,
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 100,
    height: 100,
  },
}));

export default useStyles;
