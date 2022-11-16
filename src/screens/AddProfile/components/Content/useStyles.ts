import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  content: {
    flex: 1,
  },
  scrollViewOuter: {
    marginTop: theme.spacing.m,
    marginHorizontal: -theme.spacing.m,
  },
  scrollViewInner: {
    padding: 20,
    flexGrow: 1,
  },
}));

export default useStyles;
