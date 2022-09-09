import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.m,
  },
  contentContainer: {
    backgroundColor: theme.colors.white,
  },
}));

export default useStyles;
