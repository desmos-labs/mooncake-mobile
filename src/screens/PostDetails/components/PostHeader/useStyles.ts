import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  divider: {
    borderColor: theme.colors.dividerGrey,
    borderWidth: 0.5,
  },
}));

export default useStyles;
