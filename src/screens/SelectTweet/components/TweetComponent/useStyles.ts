/**
 * Style hook for the ChangePassword screen
 */
import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingVertical: theme.spacing.s,
  },
  image: {
    resizeMode: 'contain',
    width: 24,
    height: 24,
    right: 0,
    marginLeft: 'auto',
    alignSelf: 'flex-start',
  },
  profilePic: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
}));

export default useStyles;
