import {makeStyle} from 'config/theme';

/**
 * Style hook for the ManageConnectChains screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  textContainer: {
    padding: theme.spacing.m,
  },
  descriptionText: {
    marginTop: theme.spacing.m,
  },
  snackbar: {
    zIndex: 2,
    backgroundColor: theme.colors.white,
  },
  flatListContainer: {
    flexGrow: 1,
  },
}));

export default useStyles;
