import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.m,
  },
  contentContainer: {
    padding: theme.spacing.m,
    flexGrow: 1,
    backgroundColor: theme.colors.white,
  },
}));

export default useStyles;
