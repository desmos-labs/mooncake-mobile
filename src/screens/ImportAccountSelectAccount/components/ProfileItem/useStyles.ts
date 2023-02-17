import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 20,
  },
  avatar: {
    marginRight: theme.spacing.m,
  },
}));

export default useStyles;
