import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  divider: {
    borderColor: theme.colors.neutralVariants['200'],
    borderWidth: 0.5,
  },
  date: {
    color: theme.colors.neutralVariants['600'],
  },
}));

export default useStyles;
