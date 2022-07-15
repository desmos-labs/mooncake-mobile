import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
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
