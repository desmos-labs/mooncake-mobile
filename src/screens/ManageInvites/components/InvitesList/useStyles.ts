import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    justifyContent: 'center',
    marginHorizontal: theme.spacing.m,
    marginTop: 80,
  },
  emptyImage: {
    width: 96,
    height: 70,
    resizeMode: 'cover',
    marginBottom: theme.spacing.l,
  },
  header: {
    flex: 1,
    backgroundColor: theme.colors.backgroundGrey,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.s,
  },
}));

export default useStyles;
