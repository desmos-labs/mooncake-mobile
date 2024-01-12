import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundGrey,
    marginRight: theme.spacing.s,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: theme.spacing.l,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));

export default useStyles;
