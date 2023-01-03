import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingTop: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
  },
}));

export default useStyles;
