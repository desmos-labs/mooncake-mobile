import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  contentContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
  },
  loaderView: {
    flex: 1,
    marginBottom: theme.spacing.l,
  },
}));

export default useStyles;
