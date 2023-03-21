import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.m,
  },
  innerContainer: {
    backgroundColor: 'white',
    padding: theme.spacing.m,
    borderRadius: theme.roundness,
  },
  message: { alignSelf: 'center', marginBottom: theme.spacing.m },
}));

export default useStyles;
