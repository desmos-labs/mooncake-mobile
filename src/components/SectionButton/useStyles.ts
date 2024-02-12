import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacings.m,
  },
  label: {
    flex: 1,
  },
  value: {
    color: theme.colors.neutralVariants['600'],
  },
  icon: {
    height: 24,
    width: 24,
    marginRight: theme.spacings.s,
    tintColor: theme.colors.neutralVariants['900'],
  },
}));

export default useStyles;
