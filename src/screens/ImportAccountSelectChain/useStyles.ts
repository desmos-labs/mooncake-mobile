import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  renderItem: {
    backgroundColor: 'white',
    paddingHorizontal: theme.spacing.m,
    marginHorizontal: -theme.spacing.m,
    paddingBottom: theme.spacing.m,
  },
}));

export default useStyles;
