import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingVertical: theme.spacing.m,
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
    maxWidth: '50%',
  },
  followButton: {
    minWidth: 86,
    height: 34,
    justifyContent: 'center',
  },
  buttonView: {
    marginLeft: 'auto',
    right: 1,
    justifyContent: 'center',
  },
  feesText: {
    right: 0,
    marginLeft: 'auto',
    color: theme.colors.red01,
  },
  flexRowView: { flexDirection: 'row', alignItems: 'center' },
}));

export default useStyles;
