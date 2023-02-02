import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  outerContainer: {
    marginVertical: theme.spacing.m,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.surfaceBlack,
    marginRight: theme.spacing.s,
  },
}));

export default useStyles;
