import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    alignSelf: 'center',
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.white,
  },
  emptyImage: {
    height: 72,
    resizeMode: 'contain',
    marginVertical: theme.spacing.m,
    alignSelf: 'center',
  },
  text: { textAlign: 'center' },
  button: {
    marginHorizontal: 150,
    justifyContent: 'center',
  },
}));

export default useStyles;
