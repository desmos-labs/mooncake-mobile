import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

export default useStyles;
