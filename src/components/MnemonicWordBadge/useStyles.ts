import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
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
