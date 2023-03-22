import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  loadingContainer: {
    backgroundColor: theme.colors.white,
    flexGrow: 1,
    paddingVertical: 50,
    justifyContent: 'center',
    alignContent: 'center',
  },
}));

export default useStyles;
