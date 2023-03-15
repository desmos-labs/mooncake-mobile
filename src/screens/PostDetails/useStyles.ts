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
}));

export default useStyles;
