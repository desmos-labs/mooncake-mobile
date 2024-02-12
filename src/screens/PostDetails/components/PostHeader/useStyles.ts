import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  divider: {
    borderColor: theme.colors.neutralVariants['300'],
    borderWidth: 0.5,
  },
}));

export default useStyles;
