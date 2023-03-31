import { makeStyle } from 'config/theme';

/**
 * Style hook for the EnterComment screen.
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
  },
  topBar: {
    alignItems: 'center',
  },
  postButton: {
    width: 61,
    height: 36,
  },
  contentContainer: {
    padding: theme.spacing.m,
  },
  avatarGroup: {
    alignSelf: 'flex-start',
    paddingTop: theme.spacing.s,
    marginRight: theme.spacing.m,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  bottomPanel: {
    paddingHorizontal: theme.spacing.m,
  },
  postButtonText: {
    color: theme.colors.white,
  },
  input: {
    color: theme.colors.surfaceBlack,
    minHeight: 100,
  },
}));

export default useStyles;
