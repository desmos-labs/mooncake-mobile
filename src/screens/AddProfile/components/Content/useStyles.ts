import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexGrow: 1,
  },
  scrollViewOuter: {
    flexGrow: 1,
    marginTop: theme.spacing.m,
  },
  scrollViewInner: {
    padding: 20,
    flexGrow: 1,
  },
  button: {
    padding: theme.spacing.s,
  },
  textButton: {
    color: theme.colors.surfaceBlack,
    textTransform: 'none',
  },
  buttonLabel: {
    color: theme.colors.white,
    textTransform: 'none',
  },
}));

export default useStyles;
