import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
  },
}));

export default useStyles;
