import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    alignSelf: 'center',
    marginTop: theme.spacings.xl,
    backgroundColor: theme.colors.white,
  },
  emptyImage: {
    height: 72,
    resizeMode: 'contain',
    marginVertical: theme.spacings.m,
    alignSelf: 'center',
  },
  text: { textAlign: 'center' },
  button: {
    marginHorizontal: 150,
    justifyContent: 'center',
  },
}));

export default useStyles;
