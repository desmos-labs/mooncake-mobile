import {makeStyle} from 'config/theme';

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
  flexRowView: {flexDirection: 'row'},
}));

export default useStyles;
