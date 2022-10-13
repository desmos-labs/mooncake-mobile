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
    paddingBottom: 0,
    backgroundColor: theme.colors.background,
  },
  zIndexWrapper: {
    zIndex: 2,
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
    paddingTop: theme.spacing.l,
    paddingHorizontal: 20,
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
