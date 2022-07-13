import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
    padding: theme.spacing.s,
    minWidth: 24,
  },
  index: {
    position: 'absolute',
    top: theme.spacing.s,
    right: theme.spacing.s,
    fontSize: 8,
    color: theme.colors.text,
  },
}));

export default useStyles;
