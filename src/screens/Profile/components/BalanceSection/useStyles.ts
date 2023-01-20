import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingVertical: theme.spacing.m,
  },
  divider: {
    backgroundColor: theme.colors.surfaceGrey,
    height: 1,
    marginVertical: theme.spacing.m,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
}));

export default useStyles;
