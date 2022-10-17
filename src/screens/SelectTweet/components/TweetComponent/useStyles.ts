/**
 * Style hook for the ChangePassword screen
 */
import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.s,
    backgroundColor: theme.colors.white,
    flexDirection: 'column',
  },
  image: {
    resizeMode: 'contain',
    width: 24,
    height: 24,
    right: 0,
    marginLeft: 'auto',
  },
  profilePic: {
    resizeMode: 'contain',
    height: 40,
    width: 40,
  },
}));

export default useStyles;
