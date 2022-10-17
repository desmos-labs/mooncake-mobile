/**
 * Style hook for the ChangePassword screen
 */
import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.white,
    flexDirection: 'column',
  },
  image: {
    alignSelf: 'center',
    width: 88,
    height: 88,
  },
  input: {
    marginTop: theme.spacing.s,
    borderColor: theme.colors.lightGrey01,
    borderWidth: 1,
  },
  button: {
    justifyContent: 'flex-end',
  },
  tweetContent: {
    marginTop: theme.spacing.m,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.backgroundBlue,
    padding: theme.spacing.m,
  },
  tweetBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: theme.roundness,
    borderColor: theme.colors.surfaceBlack,
    backgroundColor: theme.colors.white,
    padding: 10,
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: theme.spacing.m,
  },
}));

export default useStyles;
