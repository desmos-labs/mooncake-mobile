import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  content: {
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
}));

export default useStyles;
