import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  link: {
    color: theme.colors.primary,
  },
}));

export default useStyles;
