import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  errorImage: {
    height: 140,
    resizeMode: 'contain',
    marginVertical: theme.spacing.m,
    alignSelf: 'center',
  },
}));

export default useStyles;
