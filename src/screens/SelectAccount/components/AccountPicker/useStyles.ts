import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    flex: 1,
  },
  separator: {
    paddingVertical: theme.spacing.s,
  },
}));

export default useStyles;
