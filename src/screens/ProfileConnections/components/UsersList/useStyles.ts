import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },

  emptyListView: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: 140,
  },
  emptyListImage: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
    marginVertical: theme.spacing.m,
    alignSelf: 'center',
  },
  emptyListText: {
    width: '100%',
    textAlign: 'center',
  },
}));

export default useStyles;
