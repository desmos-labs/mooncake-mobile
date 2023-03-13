import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.roundness,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
  },
  avatar: {
    marginRight: theme.spacing.m,
  },
  address: { maxWidth: '90%' },
}));

export default useStyles;
