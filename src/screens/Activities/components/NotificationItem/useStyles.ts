import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.m,
  },
  avatar: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  profileView: {
    marginLeft: theme.spacing.s,
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: '57%',
    alignSelf: 'flex-start',
  },
  flexRowView: { flexDirection: 'row' },
  date: {
    color: theme.colors.grey02,
  },
}));

export default useStyles;
