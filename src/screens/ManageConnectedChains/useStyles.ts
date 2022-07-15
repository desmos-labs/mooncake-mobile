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
  buttonStyle: {
    color: theme.colors.white,
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
}));

export default useStyles;
