import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  title: {
    paddingVertical: theme.spacings.s,
  },
  container: {
    borderRadius: 12,
    backgroundColor: theme.colors.background,
  },
  innerContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: theme.spacings.m,
  },
}));

export default useStyles;
