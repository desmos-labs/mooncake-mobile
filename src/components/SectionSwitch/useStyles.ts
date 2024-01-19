import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: theme.spacing.s,
    tintColor: theme.colors.neutral['900'],
  },
  label: {
    flex: 1,
  },
  value: {
    color: theme.colors.grey01,
  },
  disabled: {
    opacity: 0.3,
  },
}));

export default useStyles;
