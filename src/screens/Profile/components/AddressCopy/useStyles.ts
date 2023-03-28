import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  addressText: {
    maxWidth: '35%',
    color: theme.colors.darkGrey,
  },
  copyIcon: {
    marginLeft: 6,
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
}));

export default useStyles;
