import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.roundness,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.l,
  },
  shadow: {
    marginBottom: theme.spacing.l,
  },
  buttonImage: {
    height: 24,
    width: 24,
    alignSelf: 'center',
    marginRight: theme.spacing.m,
  },
}));

export default useStyles;
