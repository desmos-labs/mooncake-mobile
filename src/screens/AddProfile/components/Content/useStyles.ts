import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.m,
  },
  scrollViewOuter: {
    flexGrow: 1,
    marginTop: theme.spacing.m,
    marginHorizontal: -theme.spacing.m,
  },
  scrollViewInner: {
    padding: 20,
    flexGrow: 1,
  },
  button: {
    padding: theme.spacing.s,
    color: theme.colors.white,
  },
  textButton: {
    color: theme.colors.surfaceBlack,
    textTransform: 'none',
  },
  buttonLabel: {
    color: theme.colors.white,
    textTransform: 'none',
  },
  topBar: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
  },
}));

export default useStyles;
