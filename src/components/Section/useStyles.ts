import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  title: {
    color: theme.colors.primary,
    paddingVertical: theme.spacing.s,
  },
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    width: '100%',
  },
}));

export default useStyles;
