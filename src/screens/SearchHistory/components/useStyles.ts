import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: theme.spacings.m,
  },
  leftItems: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
}));

export default useStyles;
