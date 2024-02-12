import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacings.m,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: theme.spacings.s,
    tintColor: theme.colors.neutralVariants['900'],
  },
  label: {
    flex: 1,
  },
  value: {
    color: theme.colors.neutralVariants['600'],
  },
  disabled: {
    opacity: 0.3,
  },
}));

export default useStyles;
