import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingVertical: theme.spacing.s,
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
  postImage: {
    borderRadius: 2,
    marginLeft: 'auto',
    right: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: 52,
    height: 52,
    resizeMode: 'cover',
  },
  flexRowView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.m,
    borderRadius: theme.roundness,
  },
  buttonStyle: {
    alignSelf: 'center',
    marginLeft: 6,
  },
  buttonImage: {
    width: 16,
    height: 16,
  },
}));

export default useStyles;
