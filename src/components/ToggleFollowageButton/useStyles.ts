import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  buttonView: {
    marginLeft: 'auto',
    right: 1,
    justifyContent: 'center',
  },
  button: {
    borderRadius: 6,
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  unfollowButton: {
    backgroundColor: '#EDEDED',
  },
}));

export default useStyles;
