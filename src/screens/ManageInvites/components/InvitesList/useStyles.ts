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
  sectionListContentContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.m,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  sendAllText: {
    color: theme.colors.grey01,
    alignSelf: 'center',
    textAlign: 'center',
  },
}));

export default useStyles;
