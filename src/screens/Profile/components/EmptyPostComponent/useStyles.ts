import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    alignSelf: 'center',
    marginTop: theme.spacings.xl,
    backgroundColor: theme.colors.white,
  },
  emptyImage: {
    height: 120,
    width: 120,
    marginVertical: theme.spacings.m,
    alignSelf: 'center',
  },
  text: { textAlign: 'center' },
  button: {
    justifyContent: 'center',
    color: theme.colors.neutralVariants['800'],
  },
}));

export default useStyles;
