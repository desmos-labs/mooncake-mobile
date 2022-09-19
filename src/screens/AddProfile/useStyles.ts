import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.m,
  },
  headerBackImage: {
    marginHorizontal: 8,
    padding: 12,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  scrollViewOuter: {margin: -20},
  scrollViewInner: {
    padding: 20,
    flexGrow: 1,
  },
}));

export default useStyles;
