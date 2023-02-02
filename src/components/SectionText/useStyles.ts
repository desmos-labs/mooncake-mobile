import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: theme.spacing.m,
  },
  label: {
    flex: 1,
  },
  value: {
    color: theme.colors.grey01,
  },
}));

export default useStyles;
