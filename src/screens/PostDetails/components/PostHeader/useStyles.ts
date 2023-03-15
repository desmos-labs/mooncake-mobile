import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  divider: {
    borderColor: theme.colors.dividerGrey,
    borderWidth: 0.5,
    marginHorizontal: -30,
  },
}));

export default useStyles;
