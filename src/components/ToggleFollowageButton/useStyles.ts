import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  buttonView: {
    marginLeft: 'auto',
    right: 1,
    justifyContent: 'center',
  },
  button: {
    borderRadius: 4,
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  unfollowButton: {
    backgroundColor: theme.colors.neutralVariants['200'],
  },
}));

export default useStyles;
